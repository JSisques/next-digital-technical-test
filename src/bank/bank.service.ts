import { Injectable, Logger } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankRepository } from './bank.repository';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(private readonly bankRepository: BankRepository) {}

  create(createBankDto: CreateBankDto) {
    this.logger.debug(`Creating bank ${createBankDto.name}`);
    return this.bankRepository.create(createBankDto);
  }

  findAll() {
    this.logger.debug('Finding all banks');
    return this.bankRepository.findAll();
  }

  findOne(id: string) {
    this.logger.debug('Finding bank', id);
    return this.bankRepository.findOne(id);
  }

  update(updateBankDto: UpdateBankDto) {
    this.logger.debug('Updating bank', updateBankDto);
    return this.bankRepository.update(updateBankDto);
  }

  remove(id: string) {
    this.logger.debug('Removing bank', id);
    return this.bankRepository.remove(id);
  }
}
