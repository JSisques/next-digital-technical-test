import { Injectable, Logger } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardRepository } from './card.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  async create(createCardDto: CreateCardDto) {
    this.logger.debug(`Creating card for account ${createCardDto.accountId}`);

    // Hash the PIN
    const hashedPin = await bcrypt.hash(createCardDto.pin, 10);
    createCardDto.pin = hashedPin;

    return await this.cardRepository.create(createCardDto);
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

  async activate(id: string, pin: string) {
    this.logger.debug(`Activating card ${id}`);
    const hashedPin = await bcrypt.hash(pin, 10);
    return this.cardRepository.update({
      id,
      isActivated: true,
      pin: hashedPin,
    });
  }

  async changePin(id: string, oldPin: string, newPin: string) {
    this.logger.debug(`Changing PIN for card ${id}`);
    const card = await this.cardRepository.findOne(id);
    if (!card) {
      throw new Error('Card not found');
    }
    const isMatch = await bcrypt.compare(oldPin, card.pin);
    if (!isMatch) {
      throw new Error('Current PIN is incorrect');
    }
    const hashedPin = await bcrypt.hash(newPin, 10);
    return this.cardRepository.update({ id, pin: hashedPin });
  }

  async validateCardAndPin(cardId: string, pin: string) {
    const card = await this.cardRepository.findOne(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    if (!card.isActivated) {
      throw new Error('Card is not activated');
    }
    const isPinValid = await bcrypt.compare(pin, card.pin);
    if (!isPinValid) {
      throw new Error('Invalid PIN');
    }
    return card;
  }
}
