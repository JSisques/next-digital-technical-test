import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';

export class CreateCardDto {
  @ApiProperty({
    description: 'Card number',
    example: '4532015112830366',
  })
  cardNumber: string;

  @ApiProperty({
    description: 'Cardholder name',
    example: 'John Doe',
  })
  cardholderName: string;

  @ApiProperty({
    description: 'Card expiration date',
    example: '2025-12-31',
  })
  expirationDate: Date;

  @ApiProperty({
    description: 'Card CVV number',
    example: 123,
  })
  cvv: number;

  @ApiProperty({
    description: 'Card PIN',
    example: '1234',
  })
  pin: string;

  @ApiProperty({
    description: 'Card activation status',
    example: true,
    default: false,
  })
  isActivated: boolean;

  @ApiProperty({
    description: 'Card type',
    enum: CardType,
    example: CardType.CREDIT,
  })
  type: CardType;

  @ApiProperty({
    description: 'Daily withdrawal limit',
    example: 1000,
  })
  withdrawalLimit: number;

  @ApiProperty({
    description: 'Associated account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  accountId: string;
}
