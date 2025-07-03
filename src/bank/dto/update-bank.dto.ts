import { PartialType } from '@nestjs/swagger';
import { CreateBankDto } from './create-bank.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateBankDto extends PartialType(CreateBankDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
