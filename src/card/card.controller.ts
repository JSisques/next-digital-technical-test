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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('Cards')
@Controller('cards')
@ApiExtraModels(CreateCardDto, UpdateCardDto)
export class CardController {
  private readonly logger = new Logger(CardController.name);
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiBody({
    type: CreateCardDto,
    examples: {
      card: {
        value: {
          accountId: '123e4567-e89b-12d3-a456-426614174000',
          type: 'DEBIT',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The card has been successfully created.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          accountId: '123e4567-e89b-12d3-a456-426614174000',
          type: 'DEBIT',
          status: 'INACTIVE',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCardDto: CreateCardDto) {
    this.logger.debug(`Creating card for account ${createCardDto.accountId}`);
    return this.cardService.create(createCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({
    status: 200,
    description: 'Return all cards.',
  })
  findAll() {
    this.logger.debug('Finding all cards');
    return this.cardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by id' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiResponse({ status: 200, description: 'Return the card.' })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Finding card ${id}`);
    return this.cardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a card' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    this.logger.debug(`Updating card ${id}`);
    return this.cardService.update(updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Removing card ${id}`);
    return this.cardService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a card with PIN' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pin: {
          type: 'string',
          description: 'PIN code for the card',
          example: '1234',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully activated.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('pin') pin: string,
  ) {
    this.logger.debug(`Activating card ${id}`);
    return this.cardService.activate(id, pin);
  }

  @Post(':id/change-pin')
  @ApiOperation({ summary: 'Change card PIN' })
  @ApiParam({ name: 'id', description: 'Card ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPin: {
          type: 'string',
          description: 'Current PIN code',
          example: '1234',
        },
        newPin: {
          type: 'string',
          description: 'New PIN code',
          example: '5678',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The PIN has been successfully changed.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  @ApiResponse({ status: 400, description: 'Invalid PIN.' })
  async changePin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('oldPin') oldPin: string,
    @Body('newPin') newPin: string,
  ) {
    this.logger.debug(`Changing PIN for card ${id}`);
    return this.cardService.changePin(id, oldPin, newPin);
  }
}
