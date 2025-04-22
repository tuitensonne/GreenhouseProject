import { PartialType } from '@nestjs/mapped-types';
import { CreateGreenhouseDto } from './create-greenhouse.dto';

export class UpdateGreenhouseDto extends PartialType(CreateGreenhouseDto) {}
