import { IsEnum, IsInt } from "class-validator";


enum SchedulerOptions {
    NOT_REPEAT = 'NOT_REPEAT',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
  }
  

export class SchedulerDto {
    @IsInt()
    userId: number;

    @IsEnum(
        SchedulerOptions,
        { message: 'options must be NOT_REPEAT, DAILY, WEEKLY, or MONTHLY' }
    )
    options: string;

    job: Job[];
}

class Job {
    @IsInt()
    deviceId: number;
    
    @IsInt()
    value: number;
}