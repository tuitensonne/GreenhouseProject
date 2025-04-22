import { Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateControllerDTO, CreateDeviceSchedulerDTO, CreateSensorDTO, DeviceAdafruitDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('devices')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('data')
  async sendData(@Body() device: DeviceAdafruitDto) {
    return this.devicesService.sendData(device);
  }

  @Post('controllers')
  async addController(@Body() device: CreateControllerDTO) {
    return this.devicesService.addController(device);
  }

  @Post('sensors')
  async addSensor(@Body() device: CreateSensorDTO) {
    return this.devicesService.addSensor(device);
  }

  @Post('schedulers')
  async createScheduler(@Body() device: CreateDeviceSchedulerDTO) {
    return this.devicesService.createScheduler(device);
  }

  @Get('controllers')
  async getControllers(
    @Query('greenhouseId') greenhouseId: number,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.devicesService.getControllers(greenhouseId, pageOffset, limit);
  }
  @Get('sensors')
  async getSensors(
    @Query('greenhouseId') greenhouseId: number,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.devicesService.getSensors(greenhouseId, pageOffset, limit);
  }

  @Get('sensor-records/:id')
  async getSensorRecord(
    @Param('id') id: number,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.devicesService.getSensorRecord(id, pageOffset, limit)
  }

  @Get('controller-records/:id')
  async getControllerRecord(
    @Param('id') id: number,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.devicesService.getControllerRecord(id, pageOffset, limit)
  }
}
