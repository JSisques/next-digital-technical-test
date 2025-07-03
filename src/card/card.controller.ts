import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('card')
export class CardController {
  private readonly logger = new Logger(CardController.name);
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    this.logger.debug(`Creating card for account ${createCardDto.accountId}`);
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll() {
    this.logger.debug('Finding all cards');
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Finding card ${id}`);
    return this.cardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    this.logger.debug(`Updating card ${id}`);
    return this.cardService.update(updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Removing card ${id}`);
    return this.cardService.remove(id);
  }

  @Post(':id/activate')
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('pin') pin: string,
  ) {
    this.logger.debug(`Activating card ${id}`);
    return this.cardService.activate(id, pin);
  }

  @Post(':id/change-pin')
  async changePin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('oldPin') oldPin: string,
    @Body('newPin') newPin: string,
  ) {
    this.logger.debug(`Changing PIN for card ${id}`);
    return this.cardService.changePin(id, oldPin, newPin);
  }
}
