import { IsString } from "class-validator";

export class CreateGreenhouseDto {
    @IsString()
    name: string;

    @IsString()
    location: string;
}
