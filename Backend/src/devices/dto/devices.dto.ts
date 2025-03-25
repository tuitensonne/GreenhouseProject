import { IsDate, IsInt, IsOptional, IsString} from "class-validator";

export class DeviceAdafruitDto {
    @IsInt()
    deviceId: number;

    @IsInt()
    @IsOptional()
    value: number = 0;

    @IsInt()
    status: number;

    @IsInt()
    userId: number;
}

export class CreateSensorDTO {
    @IsString()
    deviceType: string;

    @IsString()
    topic: string;

    @IsInt()
    greenHouseId: number;

    @IsInt()
    userId: number;

    @IsInt()
    maxValue: number;

    @IsString()
    sensorType: string;
}

export class CreateControllerDTO {
    @IsString()
    deviceType: string;

    @IsString()
    topic: string;

    @IsInt()
    greenHouseId: number;

    @IsInt()
    userId: number;
    
    @IsInt()
    status: number;

    @IsInt()
    value: number;

    @IsString()
    controllerType: string;

}

export class CreateDeviceSchedulerDTO {
    @IsInt()
    deviceId: number;

    @IsInt()
    userId: number;

    @IsInt()
    status: number;

    @IsInt()
    value: number;

    @IsDate()
    timeStart: Date

    @IsDate()
    timeEnd: Date
}