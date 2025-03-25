import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateControllerDTO, CreateDeviceSchedulerDTO, CreateSensorDTO, DeviceAdafruitDto } from './dto';
import { MqttService } from 'src/mqtt/mqtt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class DevicesService {
    constructor(private readonly mqttService: MqttService,
        private readonly prisma: PrismaService
    ) {
        this.subscribeToDevice();
    }

    async sendData(devicesDto: DeviceAdafruitDto) {
        // Check whether the topic exists
        const device = await this.getDevice(devicesDto.deviceId)
        // Send data to Adafruit IO
        try {
            await this.mqttService.sendDataToAdafruit(device.topic, devicesDto.value);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }

        // save record to database
        try {
            await this.prisma.controllerRecord.create({
                data: {
                    status: devicesDto.status,
                    value: devicesDto.value,
                    dateCreated: new Date(),
                    device: {
                        connect: { CID: device.CID }
                    },
                    user: {
                        connect: { ID: devicesDto.userId }
                    }
                }
            })
            
            await this.prisma.controller.update({
                where: { CID: devicesDto.deviceId },
                data: {
                    status: devicesDto.status,
                    value: devicesDto.value
                }
            })
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }
        return { message: 'Data sent to Adafruit IO!' };
    }

    async addController(deviceDto: CreateControllerDTO) {
        try {
            const device = await this.prisma.controller.create({
                data: {
                    status: deviceDto.status,
                    controllerType: deviceDto.controllerType,
                    value: deviceDto.value,

                    topic: deviceDto.topic,
                    deviceType: deviceDto.deviceType,
                    greenHouse: {
                        connect: { GID: deviceDto.greenHouseId }
                    },
                    user: {
                        connect: { ID: deviceDto.userId }
                    }
                }
            });
            return device;
        } catch (error) { 
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Topic has been used');
                }
            }
            console.error(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }
    }

    async addSensor(deviceDto: CreateSensorDTO) {
        try {
            const device = await this.prisma.sensor.create({
                data: {
                    maxValue: deviceDto.maxValue,
                    sensorType: deviceDto.sensorType,
                    
                    topic: deviceDto.topic,
                    deviceType: deviceDto.deviceType,
                    greenHouse: {
                        connect: { GID: deviceDto.greenHouseId }
                    },
                    user: {
                        connect: { ID: deviceDto.userId }
                    }
                }
            });

            this.mqttService.subscribeToDeviceData(deviceDto.topic);
            return device;
        }  catch (error) { 
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Topic has been used');
                }
            }
            console.error(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }
    }

    async createScheduler(deviceDto: CreateDeviceSchedulerDTO) {
        // Check whether the device exists
        const device = await this.getDevice(deviceDto.deviceId)
        if (!device) {
           throw new NotFoundException("Device doesn't exist"); 
        }
        // Create real-time scheduler
        
        // Create scheduler in database
    }

    async getControllers(GID: number, pageOffset: number, limit: number) {
        try {
            const totalController = await this.prisma.controller.count({
                where: {
                    greenHouseID: GID
                },
            })
            const totalPages = Math.ceil(totalController/ limit)
            const listOfcontrollers = await this.prisma.controller.findMany({
                where: {
                    greenHouseID: GID
                },
                take: limit,
                skip: (pageOffset - 1)*limit
            })
            return {
                data: listOfcontrollers,
                pagination: {
                    currentPage: pageOffset,
                    totalPages: totalPages,
                    totalItems: totalController,
                    limit: limit,
                }
            }
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }
    }

    async getSensors(GID: number, pageOffset: number, limit: number) {
        try {
            const totalSensor = await this.prisma.sensor.count({
                where: {
                    greenHouseID: GID
                },
            })
            const totalPages = Math.ceil(totalSensor / limit)
            const listOfSensors = await this.prisma.sensor.findMany({
                where: {
                    greenHouseID: GID
                },
                take: limit,
                skip: (pageOffset - 1)*limit
            })
            return {
                data: listOfSensors,
                pagination: {
                    currentPage: pageOffset,
                    totalPages: totalPages,
                    totalItems: totalSensor,
                    limit: limit,
                }
            }
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("An error occurred! Please try again.");
        }
    }

    async subscribeToDevice() {
        const devices = await this.prisma.sensor.findMany({
            select: {
                topic: true
            }
        });
        for (const device of devices) {
            this.mqttService.subscribeToDeviceData(device.topic);
        }
    }
    
    async getDevice(deviceId: number) {
        const device = await this.prisma.controller.findUnique({
            where: { CID: deviceId }
        });
        if (!device) {
            throw new NotFoundException("Device doesn't exist");
        }
        return device
    }
}
