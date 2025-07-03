import { Currency } from '@prisma/client';
import { BankEntity } from 'src/bank/entities/bank.entity';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

export class AccountEntity {
  id: string;
  iban: string;
  balance: number;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  cards: Card[];
  transactions: Transaction[];
  bank?: BankEntity;
  bankId?: string;
}
