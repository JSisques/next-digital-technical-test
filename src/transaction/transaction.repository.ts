import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  update(updateTransactionDto: UpdateTransactionDto) {
    const { id, ...data } = updateTransactionDto;
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  findByAccountId(accountId: string) {
    return this.prisma.transaction.findMany({
      where: { accountId },
    });
  }
}
