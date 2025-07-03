import { Currency } from '@prisma/client';
import { BankEntity } from 'src/bank/entities/bank.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

export class AccountEntity {
  id: string;
  iban: string;
  balance: number;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  cards: CardEntity[];
  transactions: TransactionEntity[];
  bank?: BankEntity;
  bankId?: string;
}
