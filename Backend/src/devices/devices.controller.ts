import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateControllerDTO, CreateDeviceSchedulerDTO, CreateSensorDTO, DeviceAdafruitDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('devices')
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

  @UseGuards(AuthGuard)
  @Post('sendData')
  async sendData(@Body() device : DeviceAdafruitDto) {
    return this.devicesService.sendData(device);
  }

  @UseGuards(AuthGuard)
  @Post('addController')
  async addDevice(@Body() device: CreateControllerDTO) {
    return this.devicesService.addController(device);
  }
 
  @UseGuards(AuthGuard)
  @Post('addSensor')
  async addSensor(@Body() device: CreateSensorDTO) {
    return this.devicesService.addSensor(device);
  }

  @UseGuards(AuthGuard)
  @Post('createScheduler')
  async createScheduler(@Body() device: CreateDeviceSchedulerDTO) {
    return this.devicesService.createScheduler(device);
  }

  @UseGuards(AuthGuard)
  @Get('getControllers')
  async getControllers(
    @Query('greenhouseId') GID: number,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.devicesService.getControllers(GID, pageOffset, limit);
  }

  @UseGuards(AuthGuard)
  @Get('getSensors')
  async getSensors(
    @Query('greenhouseId') GID: number,
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.devicesService.getSensors(GID, pageOffset, limit);
  }

}
