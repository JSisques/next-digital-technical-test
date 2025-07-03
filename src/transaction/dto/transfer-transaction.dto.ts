import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class TransferTransactionDto {
  @ApiProperty({
    description: 'UUID of the source account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  fromAccountId: string;

  @ApiProperty({
    description: 'IBAN of the destination account',
    example: 'ES9121000418450200051332',
  })
  @IsString()
  @IsNotEmpty()
  @Length(15, 34)
  toIban: string;

  @ApiProperty({ description: 'Amount to transfer', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'UUID of the card used for authentication',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cardId: string;

  @ApiProperty({ description: 'Card PIN', example: '1234' })
  @IsString()
  @Length(4, 6)
  @IsNotEmpty()
  pin: string;
}
