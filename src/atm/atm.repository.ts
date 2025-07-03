import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';

@Injectable()
export class AtmRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createAtmDto: CreateAtmDto) {
    return this.prisma.atm.create({
      data: createAtmDto,
    });
  }

  findAll() {
    return this.prisma.atm.findMany();
  }

  findOne(id: string) {
    return this.prisma.atm.findUnique({
      where: { id },
    });
  }

  update(updateAtmDto: UpdateAtmDto) {
    const { id, ...data } = updateAtmDto;
    return this.prisma.atm.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.atm.delete({
      where: { id },
    });
  }
}
