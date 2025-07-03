import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Currency, TransactionType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Transaction amount', example: 100.5 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({
    enum: Currency,
    description: 'Currency of the transaction',
    example: 'USD',
  })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({
    enum: TransactionType,
    description: 'Type of transaction',
    example: 'DEPOSIT',
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Transaction description',
    example: 'Monthly rent payment',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'UUID of the associated card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  cardId?: string;

  @ApiProperty({
    description: 'UUID of the associated account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}
