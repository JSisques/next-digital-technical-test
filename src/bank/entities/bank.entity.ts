import { AccountEntity } from 'src/account/entities/account.entity';
import { AtmEntity } from 'src/atm/entities/atm.entity';

export class BankEntity {
  id: string;
  name: string;
  atms: AtmEntity[];
  accounts: AccountEntity[];
  commission: number;
}
