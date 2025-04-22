import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { GreenhouseService } from './greenhouse.service';
import { CreateGreenhouseDto } from './dto/create-greenhouse.dto';
import { UpdateGreenhouseDto } from './dto/update-greenhouse.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('greenhouse')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class GreenhouseController {
  constructor(private readonly greenhouseService: GreenhouseService) {}

  @Post()
  create(@Body() createGreenhouseDto: CreateGreenhouseDto) {
    return this.greenhouseService.create(createGreenhouseDto);
  }

  @Get('details')
  getListDetailGreenhouse(
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.greenhouseService.getListDetailGreenhouse(pageOffset, limit);
  }

  @Get('names')
  getListGreenhouse(
    @Query('pageOffset') pageOffset: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.greenhouseService.getListGreenhouse(pageOffset, limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGreenhouseDto: UpdateGreenhouseDto) {
    return this.greenhouseService.update(+id, updateGreenhouseDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.greenhouseService.delete(+id);
  }
}
