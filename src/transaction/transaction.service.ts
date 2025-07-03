import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';
import { CardService } from 'src/card/card.service';
import { AccountRepository } from 'src/account/account.repository';
import { TransactionType } from '@prisma/client';
import { BankService } from 'src/bank/bank.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly cardService: CardService,
    private readonly accountRepository: AccountRepository,
    private readonly bankService: BankService,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    this.logger.debug(
      `Creating transaction for account ${createTransactionDto.accountId}`,
    );
    return this.transactionRepository.create(createTransactionDto);
  }

  findAll() {
    this.logger.debug('Finding all transactions');
    return this.transactionRepository.findAll();
  }

  findOne(id: string) {
    this.logger.debug(`Finding transaction ${id}`);
    return this.transactionRepository.findOne(id);
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    this.logger.debug(`Updating transaction ${id}`);
    return this.transactionRepository.update(updateTransactionDto);
  }

  remove(id: string) {
    this.logger.debug(`Removing transaction ${id}`);
    return this.transactionRepository.remove(id);
  }

  findByAccountId(accountId: string) {
    this.logger.debug(`Finding transactions for account ${accountId}`);
    return this.transactionRepository.findByAccountId(accountId);
  }

  async transfer(transferDto: TransferTransactionDto) {
    this.logger.debug(
      `Processing transfer from account ${transferDto.fromAccountId} to IBAN ${transferDto.toIban}`,
    );

    // Validate card and PIN
    const card = await this.cardService.validateCardAndPin(
      transferDto.cardId,
      transferDto.pin,
    );

    // Check if card is associated with the source account
    if (card.accountId !== transferDto.fromAccountId) {
      throw new Error('Card is not associated with the source account');
    }
    // Get source account
    const fromAccount = await this.accountRepository.findOne(
      transferDto.fromAccountId,
    );
    if (!fromAccount) {
      throw new Error('Source account not found');
    }
    // Validate destination IBAN (simple format)
    if (
      !/^([A-Z]{2}[0-9]{2}[A-Z0-9]{1,30})$/.test(
        transferDto.toIban.replace(/\s+/g, ''),
      )
    ) {
      throw new Error('Invalid destination IBAN format');
    }
    // Get destination account by IBAN
    const toAccount = (await this.accountRepository.findAll()).find(
      (acc) =>
        acc.iban.replace(/\s+/g, '') === transferDto.toIban.replace(/\s+/g, ''),
    );
    if (!toAccount) {
      throw new Error('Destination account not found');
    }
    // Check if source account has enough balance
    if (fromAccount.balance < transferDto.amount) {
      throw new Error('Insufficient funds');
    }
    // Check if transfer is to another bank and calculate commission
    let commission = 0;
    if (fromAccount.bankId !== toAccount.bankId) {
      commission = await this.bankService.calculateCommission(
        fromAccount.bankId,
        transferDto.amount,
      );
    }
    // Register transfer transaction
    await this.transactionRepository.create({
      amount: transferDto.amount,
      currency: fromAccount.currency,
      type: TransactionType.TRANSFER_SENT,
      description: `Transfer to IBAN ${transferDto.toIban}`,
      cardId: card.id,
      accountId: fromAccount.id,
    });
    // Register reception transaction
    await this.transactionRepository.create({
      amount: transferDto.amount,
      currency: toAccount.currency,
      type: TransactionType.TRANSFER_RECEIVED,
      description: `Transfer from account ${fromAccount.iban}`,
      accountId: toAccount.id,
    });
    // Registrar la transacción de comisión si aplica
    if (commission > 0) {
      await this.transactionRepository.create({
        amount: commission,
        currency: fromAccount.currency,
        type: TransactionType.FEE,
        description: `Transfer commission to IBAN ${transferDto.toIban}`,
        cardId: card.id,
        accountId: fromAccount.id,
      });
    }
    // Actualizar saldos
    await this.accountRepository.update({
      id: fromAccount.id,
      balance: fromAccount.balance - transferDto.amount - commission,
    });
    await this.accountRepository.update({
      id: toAccount.id,
      balance: toAccount.balance + transferDto.amount,
    });
    return {
      message: 'Transfer successful',
      transferred: transferDto.amount,
      commission,
      fromNewBalance: fromAccount.balance - transferDto.amount - commission,
      toNewBalance: toAccount.balance + transferDto.amount,
    };
  }
}
