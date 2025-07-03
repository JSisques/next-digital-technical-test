import { Injectable, Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly accountRepository: AccountRepository) {}

  create(createAccountDto: CreateAccountDto) {
    this.logger.debug(`Creating account ${createAccountDto.iban}`);
    return this.accountRepository.create(createAccountDto);
  }

  findAll() {
    this.logger.debug('Finding all accounts');
    return this.accountRepository.findAll();
  }

  findOne(id: string) {
    this.logger.debug(`Finding account ${id}`);
    return this.accountRepository.findOne(id);
  }

  update(updateAccountDto: UpdateAccountDto) {
    this.logger.debug(`Updating account ${updateAccountDto.id}`);
    return this.accountRepository.update(updateAccountDto);
  }

  remove(id: string) {
    this.logger.debug(`Removing account ${id}`);
    return this.accountRepository.remove(id);
  }
}
