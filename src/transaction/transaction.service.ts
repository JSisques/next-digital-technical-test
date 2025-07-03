import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly transactionRepository: TransactionRepository) {}

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
}
