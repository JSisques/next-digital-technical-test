import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionEntity } from './entities/transaction.entity';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: TransactionEntity,
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions.',
    type: [TransactionEntity],
  })
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the transaction.',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully updated.',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully deleted.',
    type: TransactionEntity,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.remove(id);
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get all transactions for a specific account' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions for the given account.',
    type: [TransactionEntity],
  })
  findByAccountId(@Param('accountId', ParseUUIDPipe) accountId: string) {
    return this.transactionService.findByAccountId(accountId);
  }
}
