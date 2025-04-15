import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DevicesService } from 'src/devices/devices.service';

@Processor('scheduler')
export class SchedulerProcessor {
  constructor(private readonly deviceService: DevicesService) {
    console.log('[Processor] SchedulerProcessor has been initialized');
  }

  @Process('trigger-devices')
  async handleScheduleJob(job: Job) {
    try {
      const deviceJobs = job.data.deviceId.map(async (device) => {
        const dataToAdaOn = {
          deviceId: device,
          userId: job.data.userId,
          value: job.data.value,
          status: 1
        };
        await this.deviceService.sendData(dataToAdaOn, true);
  
        await this.sleep(job.data.duration * 1000);
  
        const dataToAdaOff = {
          deviceId: device,
          userId: job.data.userId,
          value: 0,
          status: 0
        };
        await this.deviceService.sendData(dataToAdaOff, true);
      });
  
      await Promise.all(deviceJobs);
    } catch (error) {
      console.log(error);
      throw error;
    }
  
    return true;
  }
  
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
}
