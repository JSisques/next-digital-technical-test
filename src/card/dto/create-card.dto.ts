import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsUUID,
  Length,
  Matches,
  Min,
  Max,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    description: 'Card number',
    example: '4532015112830366',
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  @Matches(/^[0-9]+$/, { message: 'Card number must contain only numbers' })
  cardNumber: string;

  @ApiProperty({
    description: 'Cardholder name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Cardholder name must contain only letters and spaces',
  })
  cardholderName: string;

  @ApiProperty({
    description: 'Card expiration date',
    example: '2025-12-31',
  })
  @IsDate()
  @IsNotEmpty()
  expirationDate: Date;

  @ApiProperty({
    description: 'Card CVV number',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(999)
  cvv: number;

  @ApiProperty({
    description: 'Card PIN',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^[0-9]+$/, { message: 'PIN must contain only numbers' })
  pin: string;

  @ApiProperty({
    description: 'Card activation status',
    example: true,
    default: false,
  })
  @IsBoolean()
  isActivated: boolean;

  @ApiProperty({
    description: 'Card type',
    enum: CardType,
    example: CardType.CREDIT,
  })
  @IsEnum(CardType)
  @IsNotEmpty()
  type: CardType;

  @ApiProperty({
    description: 'Daily withdrawal limit',
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  withdrawalLimit: number;

  @ApiProperty({
    description: 'Associated account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}
