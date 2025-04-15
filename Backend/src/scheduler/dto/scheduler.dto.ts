import { IsArray, IsDate, IsEnum, IsInt, IsOptional, ValidateNested } from "class-validator";

export enum SchedulerOptions {
  NOT_REPEAT = 'NOT_REPEAT',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class SchedulerDto {
  @IsEnum(SchedulerOptions, {
    message: 'options must be NOT_REPEAT, DAILY, WEEKLY, or MONTHLY',
  })
  options: SchedulerOptions;

  @IsDate()
  timeStart: Date;

  @IsInt()
  duration: number;

  @IsInt()
  value: number;
  
  @IsDate()
  @IsOptional()
  recurrenceEnd: Date

  @IsArray()
  @IsInt({ each: true })
  deviceId: number[];
}
