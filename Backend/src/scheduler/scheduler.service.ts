import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SchedulerService {
    constructor(@InjectQueue('scheduler') private readonly schedulerQueue : Queue) {}

    async addJob(data: any) {
        await this.schedulerQueue.add({
            addJob: data}
        );
    }
}
