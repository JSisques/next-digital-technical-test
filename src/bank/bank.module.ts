import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BankRepository } from './bank.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BankController],
  providers: [BankService, BankRepository],
})
export class BankModule {}
