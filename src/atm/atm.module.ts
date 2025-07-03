import { Module } from '@nestjs/common';
import { AtmService } from './atm.service';
import { AtmController } from './atm.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AtmRepository } from './atm.repository';
import { CardModule } from 'src/card/card.module';
import { CardService } from 'src/card/card.service';
import { CardRepository } from 'src/card/card.repository';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { AccountRepository } from 'src/account/account.repository';
import { BankRepository } from 'src/bank/bank.repository';
import { BankService } from 'src/bank/bank.service';

@Module({
  imports: [PrismaModule],
  controllers: [AtmController],
  providers: [
    AtmService,
    AtmRepository,
    CardService,
    CardRepository,
    AccountRepository,
    TransactionRepository,
    BankRepository,
    BankService,
  ],
})
export class AtmModule {}
