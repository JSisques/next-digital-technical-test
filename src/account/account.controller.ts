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
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('accounts')
@ApiExtraModels(CreateAccountDto, UpdateAccountDto)
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({
    type: CreateAccountDto,
    examples: {
      account: {
        value: {
          iban: 'ES91 2100 0418 4502 0005 1332',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          balance: 1000,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The account has been successfully created.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          iban: 'ES91 2100 0418 4502 0005 1332',
          bankId: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          balance: 1000,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createAccountDto: CreateAccountDto) {
    this.logger.debug(`Creating account ${createAccountDto.iban}`);
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return all accounts.',
  })
  findAll() {
    this.logger.debug('Finding all accounts');
    return this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by id' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the account.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Finding account ${id}`);
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    this.logger.debug(`Updating account ${id}`);
    return this.accountService.update(updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Removing account ${id}`);
    return this.accountService.remove(id);
  }
}
