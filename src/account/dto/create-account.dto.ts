import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The IBAN of the account',
    example: 'ES91 2100 0418 4502 0005 1332',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  iban: string;

  @ApiProperty({
    description: 'Initial balance of the account',
    example: 1000.5,
    default: 0.0,
    required: false,
  })
  @IsNumber()
  balance?: number;

  @ApiProperty({
    description: 'Currency of the account',
    enum: Currency,
    default: Currency.EUR,
    required: false,
  })
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({
    description: 'ID of the bank this account belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  bankId?: string;
}
