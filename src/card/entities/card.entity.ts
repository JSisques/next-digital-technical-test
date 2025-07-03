import { CardType } from '@prisma/client';
import { AccountEntity } from 'src/account/entities/account.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

export class CardEntity {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expirationDate: Date;
  cvv: number;
  pin: string;
  isActivated: boolean;
  type: CardType;
  withdrawalLimit: number;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: TransactionEntity[];
}
