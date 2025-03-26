import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SchedulerDto } from './dto';

@Injectable()
export class SchedulerService {
    constructor(@InjectQueue('scheduler') private readonly schedulerQueue : Queue) {}

    async addJob(schedule: SchedulerDto) {
        await this.schedulerQueue.add({
            addJob: schedule}
        );
    }
}
