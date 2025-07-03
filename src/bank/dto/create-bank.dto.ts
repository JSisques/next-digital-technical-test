import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDto {
  @ApiProperty({
    description: 'The name of the bank',
    example: 'Bank of America',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
