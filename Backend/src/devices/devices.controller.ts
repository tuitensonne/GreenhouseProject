import { Body, Controller, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateControllerDTO, CreateSensorDTO, DeviceAdafruitDto } from './dto';
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

  // @UseGuards(AuthGuard)
  // @Get('getListDevices')
  // async getListDevices(
  //   @Query('pageOffset') pageOffset: number = 1, 
  //   @Query('limit') limit: number = 10
  // ) {
  //   return this.devicesService.getListDevices(+pageOffset, +limit);
  // }
}
