import { Injectable, Logger } from '@nestjs/common';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtmRepository } from './atm.repository';

@Injectable()
export class AtmService {
  private readonly logger = new Logger(AtmService.name);

  constructor(private readonly atmRepository: AtmRepository) {}

  create(createAtmDto: CreateAtmDto) {
    this.logger.debug(`Creating ATM ${createAtmDto.name}`);
    return this.atmRepository.create(createAtmDto);
  }

  findAll() {
    this.logger.debug('Finding all ATMs');
    return this.atmRepository.findAll();
  }

  findOne(id: string) {
    this.logger.debug(`Finding ATM ${id}`);
    return this.atmRepository.findOne(id);
  }

  update(updateAtmDto: UpdateAtmDto) {
    const { id, ...data } = updateAtmDto;
    this.logger.debug(`Updating ATM ${id}`);
    return this.atmRepository.update(updateAtmDto);
  }

  remove(id: string) {
    this.logger.debug(`Removing ATM ${id}`);
    return this.atmRepository.remove(id);
  }
}
