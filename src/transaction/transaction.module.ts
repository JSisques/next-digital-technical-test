import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from 'src/account/account.repository';
import { CardService } from 'src/card/card.service';
import { CardRepository } from 'src/card/card.repository';
import { BankService } from 'src/bank/bank.service';
import { BankRepository } from 'src/bank/bank.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    CardService,
    AccountRepository,
    CardRepository,
    BankService,
    BankRepository,
  ],
})
export class TransactionModule {}
