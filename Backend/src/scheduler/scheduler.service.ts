import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { SchedulerOptions } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
    constructor(
        @InjectQueue('scheduler') private readonly schedulerQueue : Queue,
        private readonly prisma: PrismaService
    ) {}

    async getControllerByScheduleId(scheduleId: number) {
        const controller = await this.prisma.controllerScheduler.findMany({
            where: { schedulerID: scheduleId },
            select: { device: {} }
        });
        if (!controller) throw new NotFoundException("Not found controller ID");
        return controller;
    }

    async getJobsByGreenhouse(greenhouseId: number, pageOffset: number, limit: number) {
        const totalRecord = await this.prisma.scheduler.count({
          where: {
            controllerScheduler: {
              some: {
                device: {
                  greenHouseID: greenhouseId
                }
              }
            }
          }
        });        
        const totalPages = Math.ceil(totalRecord / limit);        
        const jobs = await this.prisma.scheduler.findMany({
          where: {
            controllerScheduler: {
              some: {
                device: {
                  greenHouseID: greenhouseId
                }
              }
            }
          },
          orderBy: { timeCreated: 'desc' },
          take: limit,
          skip: (pageOffset - 1) * limit,
        });        
        return {
          data: jobs,
          pagination: {
            currentPage: pageOffset,
            totalPages: totalPages,
            totalItems: totalRecord,
            limit: limit,
          }
        };
    }

    async deleteJob(scheduleId: number) {
        try {
            await this.schedulerQueue.removeJobs(`${scheduleId}`)

            this.prisma.scheduler.delete({
                where: { SID : scheduleId}
            })

            return { message: "Successfully deleted"}
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async updateJob(schedule: any) {
        try {
            const scheduler = await this.prisma.scheduler.findUnique({
                where: { SID: schedule.scheduleId }
            });
            if (!scheduler) throw new NotFoundException("Not found scheduler ID");
        
            const updateData: any = {
                timeUpdated: new Date()
            };
            if (schedule.value !== undefined) updateData.value = schedule.value;
            if (schedule.timeStart !== undefined) updateData.timeStart = schedule.timeStart;
            if (schedule.duration !== undefined) updateData.duration = schedule.duration;
            if (schedule.option !== undefined) updateData.recurrenceRule = schedule.option;
            if (schedule.recurrenceEnd !== undefined) updateData.recurrenceEnd = schedule.recurrenceEnd;
        
            if (!schedule.deviceId) {
                const devices = await this.prisma.controllerScheduler.findMany({
                    where: { schedulerID: schedule.scheduleId },
                    select: { deviceID: true }
                });
                updateData.deviceId = devices.map(d => d.deviceID);
            } else {
                updateData.deviceId = schedule.deviceId
            }

            const { delay, cron } = this.createOptionForScheduler(
                schedule.timeStart ?? scheduler.timeStart,
                schedule.option ?? scheduler.recurrenceRule
            );

            await this.schedulerQueue.removeJobs(`${schedule.scheduleId}`);
        
            if (delay) 
                await this.schedulerQueue.add(
                    `trigger-devices`,
                    updateData,
                    {
                        jobId: `${schedule.scheduleId}`,
                        delay,
                        repeat: cron ? { cron } : undefined,
                        attempts: 3,
                        backoff: { type: 'exponential', delay: 5000 },
                    }
                );
        
            const { deviceId, ...update } = updateData;
        
            await this.prisma.scheduler.update({
                where: { SID: schedule.scheduleId },
                data: update
          });
      
           return { message: "Successfully Updated" };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
      

    async createJob(schedule: any) {
        try {
            const {delay, cron} = this.createOptionForScheduler(schedule.timeStart, schedule.options)
            let scheduleId: number = 0
            await this.prisma.$transaction(async (tx) => {
                const scheduler = await tx.scheduler.create({
                    data: {
                        timeCreated: new Date(Date.now()),
                        timeUpdated: new Date(Date.now()),
                        userID: schedule.userId,
                        value: schedule.value,
                        timeStart: schedule.timeStart,
                        duration: schedule.duration,
                        recurrenceRule: schedule.option,
                        recurrenceEnd: schedule.recurrenceEnd
                    }
                })
                scheduleId = scheduler.SID
                for (const device of schedule.deviceId) {
                    await tx.controllerScheduler.create({
                        data: {
                            deviceID: device,
                            schedulerID: scheduler.SID
                        }
                    }) 
                }

            })
            if (delay)
                await this.schedulerQueue.add(
                    `trigger-devices`,
                    schedule,
                    {
                        jobId: `${scheduleId}`,
                        delay,
                        repeat: cron ? {cron} : undefined,
                        attempts: 3, 
                        backoff: { type: 'exponential', delay: 5000 }
                    }
                )   


            return {message: "Create scheduler successfully"}
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("There is error in creating scheduler")
        }
    }

    private createOptionForScheduler(timeStart: Date, option: SchedulerOptions) {
        const now = new Date()
        let adjustedTime = new Date(timeStart)
    
        const isFebruary = adjustedTime.getMonth() === 1 
        const date = adjustedTime.getDate()
        const year = adjustedTime.getFullYear()
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
        const maxDayInFeb = isLeapYear ? 29 : 28
    
        if (isFebruary && date > maxDayInFeb) {
            throw new BadRequestException(`February in ${year} has no date ${date}`)
        }
    
        if (adjustedTime.getTime() < now.getTime()) {
            switch (option) {
                case SchedulerOptions.NOT_REPEAT:
                    return {delay: undefined, cron: undefined}
                case SchedulerOptions.DAILY:
                    adjustedTime.setDate(adjustedTime.getDate() + 1)
                    break
                case SchedulerOptions.WEEKLY:
                    adjustedTime.setDate(adjustedTime.getDate() + 7)
                    break
                case SchedulerOptions.MONTHLY:
                    const currentDate = adjustedTime.getDate();
                    const nextMonth = adjustedTime.getMonth() + 1;
                    const nextMonthYear = adjustedTime.getFullYear() + (nextMonth === 12 ? 1 : 0);
                    const nextMonthIndex = nextMonth % 12;
                    
                    const maxDaysInNextMonth = new Date(nextMonthYear, nextMonthIndex + 1, 0).getDate();
                    
                    if (currentDate > maxDaysInNextMonth) {
                        adjustedTime.setMonth(adjustedTime.getMonth() + 2);
                    } else {
                        adjustedTime.setMonth(adjustedTime.getMonth() + 1);
                    }
                    break
            }
        }
        
        const delay = adjustedTime.getTime() - now.getTime()
        const minute = adjustedTime.getMinutes()
        const hour = adjustedTime.getHours()
        const updatedDate = adjustedTime.getDate()
        const updatedMonth = adjustedTime.getMonth() + 1 
        const dayInWeek = adjustedTime.getDay() 
    
        let cron = ''
        switch (option) {
            case SchedulerOptions.NOT_REPEAT:
                cron = ""
                break
            case SchedulerOptions.DAILY:
                cron = `${minute} ${hour} * * *`
                break
            case SchedulerOptions.MONTHLY:
                cron = `${minute} ${hour} ${updatedDate} * *`
                break
            case SchedulerOptions.WEEKLY:
                cron = `${minute} ${hour} * * ${dayInWeek}`
                break
        }
    
        return { delay, cron }
    }
    
}
