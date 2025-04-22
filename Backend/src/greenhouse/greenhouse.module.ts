import { Module } from '@nestjs/common';
import { GreenhouseService } from './greenhouse.service';
import { GreenhouseController } from './greenhouse.controller';

@Module({
  controllers: [GreenhouseController],
  providers: [GreenhouseService],
})
export class GreenhouseModule {}
