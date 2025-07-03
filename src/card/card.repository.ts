import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createCardDto: CreateCardDto) {
    return this.prisma.card.create({
      data: createCardDto,
    });
  }

  findAll() {
    return this.prisma.card.findMany();
  }

  findOne(id: string) {
    return this.prisma.card.findUnique({
      where: { id },
    });
  }

  update(updateCardDto: UpdateCardDto) {
    return this.prisma.card.update({
      where: { id: updateCardDto.id },
      data: updateCardDto,
    });
  }

  remove(id: string) {
    return this.prisma.card.delete({
      where: { id },
    });
  }
}
