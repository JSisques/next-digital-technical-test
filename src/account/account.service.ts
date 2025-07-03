import { Injectable, Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(createAccountDto: CreateAccountDto) {
    this.logger.debug(`Creating account ${createAccountDto.iban}`);
    return this.prisma.account.create({
      data: createAccountDto,
    });
  }

  findAll() {
    this.logger.debug('Finding all accounts');
    return this.prisma.account.findMany();
  }

  findOne(id: string) {
    this.logger.debug(`Finding account ${id}`);
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  update(updateAccountDto: UpdateAccountDto) {
    const { id, ...data } = updateAccountDto;
    this.logger.debug(`Updating account ${id}`);
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    this.logger.debug(`Removing account ${id}`);
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
