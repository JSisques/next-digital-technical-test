import { Injectable, Logger } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(createBankDto: CreateBankDto) {
    this.logger.debug(`Creating bank ${createBankDto.name}`);
    return this.prisma.bank.create({
      data: createBankDto,
    });
  }

  findAll() {
    this.logger.debug('Finding all banks');
    return this.prisma.bank.findMany();
  }

  findOne(id: string) {
    this.logger.debug('Finding bank', id);
    return this.prisma.bank.findUnique({
      where: { id },
    });
  }

  update(updateBankDto: UpdateBankDto) {
    this.logger.debug('Updating bank', updateBankDto);
    const { id, ...data } = updateBankDto;
    return this.prisma.bank.update({
      where: { id: id },
      data,
    });
  }

  remove(id: string) {
    this.logger.debug('Removing bank', id);
    return this.prisma.bank.delete({
      where: { id },
    });
  }
}
