import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiProperty({
    description: 'Card ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
