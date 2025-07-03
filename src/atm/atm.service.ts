import { Injectable, Logger } from '@nestjs/common';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtmRepository } from './atm.repository';
import { CardRepository } from 'src/card/card.repository';
import * as bcrypt from 'bcrypt';
import { WithdrawAtmDto } from './dto/withdraw-atm.dto';
import { CardService } from 'src/card/card.service';
import { AccountRepository } from 'src/account/account.repository';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { TransactionType, CardType } from '@prisma/client';

@Injectable()
export class AtmService {
  private readonly logger = new Logger(AtmService.name);

  constructor(
    private readonly atmRepository: AtmRepository,
    private readonly cardService: CardService,
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  create(createAtmDto: CreateAtmDto) {
    this.logger.debug(`Creating ATM ${createAtmDto.name}`);
    return this.atmRepository.create(createAtmDto);
  }

  findAll() {
    this.logger.debug('Finding all ATMs');
    return this.atmRepository.findAll();
  }

  findOne(id: string) {
    this.logger.debug(`Finding ATM ${id}`);
    return this.atmRepository.findOne(id);
  }

  update(updateAtmDto: UpdateAtmDto) {
    const { id, ...data } = updateAtmDto;
    this.logger.debug(`Updating ATM ${id}`);
    return this.atmRepository.update(updateAtmDto);
  }

  remove(id: string) {
    this.logger.debug(`Removing ATM ${id}`);
    return this.atmRepository.remove(id);
  }

  async withdraw(withdrawAtmDto: WithdrawAtmDto) {
    this.logger.debug(
      `Processing withdrawal for card ${withdrawAtmDto.cardId} at ATM ${withdrawAtmDto.atmId}`,
    );
    // 1. Validate card and PIN
    const card = await this.cardService.validateCardAndPin(
      withdrawAtmDto.cardId,
      withdrawAtmDto.pin,
    );
    // 2. Get associated account
    const account = await this.accountRepository.findOne(card.accountId);
    if (!account) {
      throw new Error('Associated account not found');
    }
    // 3. Get ATM
    const atm = await this.atmRepository.findOne(withdrawAtmDto.atmId);
    if (!atm) {
      throw new Error('ATM not found');
    }
    // 4. Validate card type and balance/limit
    if (card.type === CardType.DEBIT) {
      if (account.balance < withdrawAtmDto.amount) {
        throw new Error('Insufficient funds');
      }
    } else if (card.type === CardType.CREDIT) {
      // Assume negative balance represents used credit
      const creditUsed = account.balance < 0 ? Math.abs(account.balance) : 0;
      const availableCredit = card.withdrawalLimit - creditUsed;
      if (withdrawAtmDto.amount > availableCredit) {
        throw new Error('Credit limit exceeded');
      }
    } else {
      throw new Error('Unsupported card type');
    }
    // 5. Do not allow withdrawal amount to exceed card limit
    if (withdrawAtmDto.amount > card.withdrawalLimit) {
      throw new Error('Withdrawal amount exceeds card limit');
    }
    // 6. Check if ATM is from another bank and calculate commission
    let commission = 0;
    if (atm.bankId !== account.bankId) {
      commission = Math.max(1, Math.round(withdrawAtmDto.amount * 0.01)); // 1% commission, minimum 1
    }
    // 7. Register withdrawal transaction
    await this.transactionRepository.create({
      amount: withdrawAtmDto.amount,
      currency: account.currency,
      type: TransactionType.WITHDRAWAL,
      description: `ATM withdrawal at ${atm.id}`,
      cardId: card.id,
      accountId: account.id,
    });
    // 8. Register commission transaction if applicable
    if (commission > 0) {
      await this.transactionRepository.create({
        amount: commission,
        currency: account.currency,
        type: TransactionType.FEE,
        description: `ATM commission at ${atm.id}`,
        cardId: card.id,
        accountId: account.id,
      });
    }
    // 9. Update account balance
    let newBalance = account.balance - withdrawAtmDto.amount - commission;
    await this.accountRepository.update({
      id: account.id,
      balance: newBalance,
    });
    return {
      message: 'Withdrawal successful',
      withdrawn: withdrawAtmDto.amount,
      commission,
      newBalance,
    };
  }
}
