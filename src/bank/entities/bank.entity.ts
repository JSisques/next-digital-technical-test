import { AccountEntity } from 'src/account/entities/account.entity';
import { Atm } from 'src/atm/entities/atm.entity';

export class BankEntity {
  id: string;
  name: string;
  atms: Atm[];
  accounts: AccountEntity[];
}
