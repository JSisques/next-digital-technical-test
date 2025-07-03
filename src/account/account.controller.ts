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

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    this.logger.debug(`Creating account ${createAccountDto.iban}`);
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    this.logger.debug('Finding all accounts');
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Finding account ${id}`);
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    this.logger.debug(`Updating account ${id}`);
    return this.accountService.update(updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Removing account ${id}`);
    return this.accountService.remove(id);
  }
}
