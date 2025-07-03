import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AtmService } from './atm.service';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { WithdrawAtmDto } from './dto/withdraw-atm.dto';
import { DepositAtmDto } from './dto/deposit-atm.dto';

@ApiTags('ATMs')
@Controller('atms')
@ApiExtraModels(CreateAtmDto, UpdateAtmDto)
export class AtmController {
  private readonly logger = new Logger(AtmController.name);

  constructor(private readonly atmService: AtmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ATM' })
  @ApiBody({
    type: CreateAtmDto,
    examples: {
      atm: {
        value: {
          name: 'ATM Central Park',
          address: '123 Central Park West',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'ACTIVE',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The ATM has been successfully created.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'ATM Central Park',
          address: '123 Central Park West',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'ACTIVE',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createAtmDto: CreateAtmDto) {
    this.logger.debug(`Creating ATM ${createAtmDto.name}`);
    return this.atmService.create(createAtmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ATMs' })
  @ApiResponse({
    status: 200,
    description: 'Return all ATMs.',
    content: {
      'application/json': {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'ATM Central Park',
            address: '123 Central Park West',
            bankId: '123e4567-e89b-12d3-a456-426614174000',
            status: 'ACTIVE',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  findAll() {
    this.logger.debug('Finding all ATMs');
    return this.atmService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ATM by id' })
  @ApiParam({
    name: 'id',
    description: 'ATM ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the ATM.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'ATM Central Park',
          address: '123 Central Park West',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'ACTIVE',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'ATM not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Finding ATM ${id}`);
    return this.atmService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ATM' })
  @ApiParam({
    name: 'id',
    description: 'ATM ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiBody({
    type: UpdateAtmDto,
    examples: {
      atm: {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'ATM Central Park Updated',
          status: 'MAINTENANCE',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The ATM has been successfully updated.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'ATM Central Park Updated',
          address: '123 Central Park West',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'MAINTENANCE',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'ATM not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAtmDto: UpdateAtmDto,
  ) {
    this.logger.debug(`Updating ATM ${id}`);
    return this.atmService.update(updateAtmDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ATM' })
  @ApiParam({
    name: 'id',
    description: 'ATM ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'The ATM has been successfully deleted.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'ATM Central Park',
          address: '123 Central Park West',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          status: 'INACTIVE',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'ATM not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Removing ATM ${id}`);
    return this.atmService.remove(id);
  }

  @Post('withdraw')
  @ApiOperation({
    summary: 'Withdraw money from an account using a card at an ATM',
  })
  @ApiResponse({ status: 201, description: 'Withdrawal successful.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or insufficient funds/credit.',
  })
  withdraw(@Body() withdrawAtmDto: WithdrawAtmDto) {
    this.logger.debug(
      `Withdraw request for card ${withdrawAtmDto.cardId} at ATM ${withdrawAtmDto.atmId}`,
    );
    return this.atmService.withdraw(withdrawAtmDto);
  }

  @Post('deposit')
  @ApiOperation({
    summary: 'Deposit money into an account using a card at an ATM',
  })
  @ApiResponse({ status: 201, description: 'Deposit successful.' })
  @ApiResponse({ status: 400, description: 'Invalid request or not allowed.' })
  deposit(@Body() depositAtmDto: DepositAtmDto) {
    this.logger.debug(
      `Deposit request for card ${depositAtmDto.cardId} at ATM ${depositAtmDto.atmId}`,
    );
    return this.atmService.deposit(depositAtmDto);
  }
}
