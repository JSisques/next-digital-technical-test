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
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Banks')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank' })
  @ApiBody({ type: CreateBankDto })
  @ApiResponse({
    status: 201,
    description: 'The bank has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiResponse({ status: 200, description: 'Return all banks.' })
  findAll() {
    return this.bankService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bank by id' })
  @ApiParam({ name: 'id', description: 'Bank ID' })
  @ApiResponse({ status: 200, description: 'Return the bank.' })
  @ApiResponse({ status: 404, description: 'Bank not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bank' })
  @ApiParam({ name: 'id', description: 'Bank ID' })
  @ApiBody({ type: UpdateBankDto })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Bank not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBankDto: UpdateBankDto,
  ) {
    return this.bankService.update(updateBankDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bank' })
  @ApiParam({ name: 'id', description: 'Bank ID' })
  @ApiResponse({
    status: 200,
    description: 'The bank has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Bank not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankService.remove(id);
  }
}
