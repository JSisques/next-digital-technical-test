import { PartialType } from '@nestjs/swagger';
import { CreateAtmDto } from './create-atm.dto';

export class UpdateAtmDto extends PartialType(CreateAtmDto) {}
