import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('scheduler')
export class SchedulerProcessor {

  @Process()
  async handleScheduleJob(job: Job) {
    console.log(`📩 Gửi email đến: ${job.data.to}`);
    console.log(`📧 Chủ đề: ${job.data.subject}`);
    console.log(`💬 Nội dung: ${job.data.body}`);
    return true;
  }
}
