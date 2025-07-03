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
  @ApiOperation({
    summary: 'Create a new card',
    description:
      'Creates a new card associated with an account. The card will be created in an inactive state and needs to be activated separately.',
  })
  @ApiBody({
    type: CreateCardDto,
    description: 'Card creation data',
    examples: {
      debitCard: {
        summary: 'Basic debit card',
        value: {
          cardNumber: '4532015112830366',
          cardholderName: 'John Doe',
          expirationDate: '2025-12-31',
          cvv: 123,
          pin: '1234',
          isActivated: false,
          type: 'DEBIT',
          withdrawalLimit: 1000,
          accountId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
      creditCard: {
        summary: 'Basic credit card',
        value: {
          cardNumber: '4539571347521445',
          cardholderName: 'Jane Smith',
          expirationDate: '2026-12-31',
          cvv: 456,
          pin: '5678',
          isActivated: false,
          type: 'CREDIT',
          withdrawalLimit: 2000,
          accountId: '123e4567-e89b-12d3-a456-426614174001',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The card has been successfully created.',
    content: {
      'application/json': {
        examples: {
          debitCard: {
            summary: 'Created debit card response',
            value: {
              id: '123e4567-e89b-12d3-a456-426614174002',
              cardNumber: '4532015112830366',
              cardholderName: 'John Doe',
              expirationDate: '2025-12-31T00:00:00.000Z',
              cvv: 123,
              isActivated: false,
              type: 'DEBIT',
              withdrawalLimit: 1000,
              accountId: '123e4567-e89b-12d3-a456-426614174000',
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid card data provided.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'cardNumber must be exactly 16 characters',
            'pin must be exactly 4 characters',
          ],
          error: 'Bad Request',
        },
      },
    },
  })
  async create(@Body() createCardDto: CreateCardDto) {
    this.logger.debug(`Creating card for account ${createCardDto.accountId}`);
    const card = await this.cardService.create(createCardDto);
    if (card && typeof card === 'object' && 'pin' in card) {
      const { pin, ...rest } = card;
      return rest;
    }
    return card;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all cards',
    description:
      'Retrieves a list of all cards in the system. Sensitive data like PINs are excluded from the response.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all cards',
    content: {
      'application/json': {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            cardNumber: '4532015112830366',
            cardholderName: 'John Doe',
            expirationDate: '2025-12-31T00:00:00.000Z',
            cvv: 123,
            isActivated: true,
            type: 'DEBIT',
            withdrawalLimit: 1000,
            accountId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  async findAll() {
    this.logger.debug('Finding all cards');
    const cards = await this.cardService.findAll();
    return Array.isArray(cards)
      ? cards.map((card) => {
          if (card && typeof card === 'object' && 'pin' in card) {
            const { pin, ...rest } = card;
            return rest;
          }
          return card;
        })
      : cards;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a card by id',
    description:
      'Retrieves detailed information about a specific card. Sensitive data like PIN is excluded.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the card to retrieve',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiResponse({
    status: 200,
    description: 'The card details',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          cardNumber: '4532015112830366',
          cardholderName: 'John Doe',
          expirationDate: '2025-12-31T00:00:00.000Z',
          cvv: 123,
          isActivated: true,
          type: 'DEBIT',
          withdrawalLimit: 1000,
          accountId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Card not found',
          error: 'Not Found',
        },
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Finding card ${id}`);
    const card = await this.cardService.findOne(id);
    if (card && typeof card === 'object' && 'pin' in card) {
      const { pin, ...rest } = card;
      return rest;
    }
    return card;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a card',
    description: 'Updates the specified fields of an existing card.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the card to update',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiBody({
    type: UpdateCardDto,
    description: 'Fields to update',
    examples: {
      updateLimit: {
        summary: 'Update withdrawal limit',
        value: {
          withdrawalLimit: 2000,
        },
      },
      updateStatus: {
        summary: 'Update activation status',
        value: {
          isActivated: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully updated.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          withdrawalLimit: 2000,
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Card not found',
          error: 'Not Found',
        },
      },
    },
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    this.logger.debug(`Updating card ${id}`);
    const card = await this.cardService.update(updateCardDto);
    if (card && typeof card === 'object' && 'pin' in card) {
      const { pin, ...rest } = card;
      return rest;
    }
    return card;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a card',
    description: 'Permanently removes a card from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the card to delete',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully deleted.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          message: 'Card successfully deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Card not found',
          error: 'Not Found',
        },
      },
    },
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Removing card ${id}`);
    const card = await this.cardService.remove(id);
    if (card && typeof card === 'object' && 'pin' in card) {
      const { pin, ...rest } = card;
      return rest;
    }
    return card;
  }

  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate a card with PIN',
    description:
      'Activates a card using the provided PIN. The card must exist and be in an inactive state.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the card to activate',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiBody({
    description: 'PIN required for activation',
    schema: {
      type: 'object',
      required: ['pin'],
      properties: {
        pin: {
          type: 'string',
          description: 'PIN code for the card (4 digits)',
          example: '1234',
          minLength: 4,
          maxLength: 4,
          pattern: '^[0-9]+$',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully activated.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          isActivated: true,
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Card not found',
          error: 'Not Found',
        },
      },
    },
  })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('pin') pin: string,
  ) {
    this.logger.debug(`Activating card ${id}`);
    const card = await this.cardService.activate(id, pin);
    if (card && typeof card === 'object' && 'pin' in card) {
      const { pin, ...rest } = card;
      return rest;
    }
    return card;
  }

  @Post(':id/change-pin')
  @ApiOperation({
    summary: 'Change card PIN',
    description:
      'Changes the PIN of an existing card. Requires the current PIN for verification.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the card',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiBody({
    description: 'Old and new PIN information',
    schema: {
      type: 'object',
      required: ['oldPin', 'newPin'],
      properties: {
        oldPin: {
          type: 'string',
          description: 'Current PIN code (4 digits)',
          example: '1234',
          minLength: 4,
          maxLength: 4,
          pattern: '^[0-9]+$',
        },
        newPin: {
          type: 'string',
          description: 'New PIN code (4 digits)',
          example: '5678',
          minLength: 4,
          maxLength: 4,
          pattern: '^[0-9]+$',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The PIN has been successfully changed.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          message: 'PIN successfully changed',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Card not found',
          error: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid PIN',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Current PIN is incorrect',
          error: 'Bad Request',
        },
      },
    },
  })
  async changePin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('oldPin') oldPin: string,
    @Body('newPin') newPin: string,
  ) {
    this.logger.debug(`Changing PIN for card ${id}`);
    const card = await this.cardService.changePin(id, oldPin, newPin);
    if (card && typeof card === 'object' && 'pin' in card) {
      const { pin, ...rest } = card;
      return rest;
    }
    return card;
  }
}
