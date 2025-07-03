import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @ApiProperty({
    description: 'The ID of the account to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
