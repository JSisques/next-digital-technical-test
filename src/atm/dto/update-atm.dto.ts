import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAtmDto } from './create-atm.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateAtmDto extends PartialType(CreateAtmDto) {
  @ApiProperty({
    description: 'The ID of the ATM to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
