import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class DepositAtmDto {
  @ApiProperty({
    description: 'UUID of the card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cardId: string;

  @ApiProperty({
    description: 'UUID of the ATM',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  atmId: string;

  @ApiProperty({ description: 'Amount to deposit', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Card PIN', example: '1234' })
  @IsString()
  @Length(4, 6)
  @IsNotEmpty()
  pin: string;
}
