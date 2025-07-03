import { Injectable, Logger } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(createBankDto: CreateBankDto) {
    return this.prisma.bank.create({
      data: createBankDto,
    });
  }

  findAll() {
    return this.prisma.bank.findMany();
  }

  findOne(id: string) {
    return this.prisma.bank.findUnique({
      where: { id },
    });
  }

  update(updateBankDto: UpdateBankDto) {
    const { id, ...data } = updateBankDto;
    return this.prisma.bank.update({
      where: { id: id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.bank.delete({
      where: { id },
    });
  }
}
