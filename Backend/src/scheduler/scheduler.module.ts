import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { BullModule } from '@nestjs/bull';
import { SchedulerProcessor } from './scheduler.processor';

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
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, SchedulerProcessor],
})
export class SchedulerModule {}
