import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { BullModule } from '@nestjs/bull';
import { MyQueueProcessor } from './scheduler.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6060,
      },
    }),
    BullModule.registerQueue({
      name: 'scheduler',
    }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, MyQueueProcessor],
})
export class SchedulerModule {}
