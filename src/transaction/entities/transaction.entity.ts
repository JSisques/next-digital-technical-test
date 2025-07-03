import { Currency, TransactionType } from '@prisma/client';

export class TransactionEntity {
  id: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  description?: string;
  createdAt: Date;
  cardId?: string;
  accountId: string;
}
