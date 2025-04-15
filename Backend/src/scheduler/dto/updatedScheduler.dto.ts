import { PartialType } from "@nestjs/mapped-types";
import { SchedulerDto } from "./scheduler.dto";
import { IsInt } from "class-validator";

export class UpdateScheduleDto extends PartialType(SchedulerDto) {
  @IsInt()
  scheduleId: number
}