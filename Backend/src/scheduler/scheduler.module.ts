import { Global, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { BullModule } from '@nestjs/bull';
import { SchedulerProcessor } from './scheduler.processor';
import { DevicesModule } from 'src/devices/devices.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'scheduler',
    }),
    DevicesModule
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, SchedulerProcessor],
  exports: [SchedulerService],
})
export class SchedulerModule {}
