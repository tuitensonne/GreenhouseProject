import { Body, Controller, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerDto } from './dto';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post("addjob")
  async addJob(@Body() schedule: SchedulerDto) {
    return this.schedulerService.addJob(schedule)
  }
}
