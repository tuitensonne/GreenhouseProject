import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateScheduleDto } from './dto/updatedScheduler.dto';

@Controller('scheduler')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
})) 
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get() 
  async getJobsByUser(
    @Req() req,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 5
  ) {
    return this.schedulerService.getJobsByUser(req.user.su, pageOffset, limit)
  }

  @Post()
  async createJob(
    @Req() req,
    @Body() schedule: SchedulerDto
  ) {
    schedule['userId'] = req.user.sub
    return this.schedulerService.createJob(schedule)
  }

  @Patch() 
  async updateJobById(
    @Req() req,
    @Body() schedule: UpdateScheduleDto
  ) {
    schedule['userId'] = req.user.sub
    return this.schedulerService.updateJob(schedule)
  }

  @Delete(':id')
  async deleteJobById(
    @Param('id') scheduleId : number
  ) {
    return this.schedulerService.deleteJob(scheduleId)
  }
}
