import { Injectable, Logger } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardRepository } from './card.repository';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  create(createCardDto: CreateCardDto) {
    this.logger.debug(`Creating card for account ${createCardDto.accountId}`);
    return this.cardRepository.create(createCardDto);
  }

  findAll() {
    this.logger.debug('Finding all cards');
    return this.cardRepository.findAll();
  }

  findOne(id: string) {
    this.logger.debug(`Finding card ${id}`);
    return this.cardRepository.findOne(id);
  }

  update(updateCardDto: UpdateCardDto) {
    this.logger.debug(`Updating card ${updateCardDto.id}`);
    return this.cardRepository.update(updateCardDto);
  }

  remove(id: string) {
    this.logger.debug(`Removing card ${id}`);
    return this.cardRepository.remove(id);
  }
}
