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

  @ApiProperty({
    description: 'Commission percentage for operations (e.g. 0.05 for 5%)',
    example: 0.05,
    required: false,
    default: 0.05,
  })
  commission?: number = 0.05;
}
