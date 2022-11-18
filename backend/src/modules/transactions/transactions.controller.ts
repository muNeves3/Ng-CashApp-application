import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ITransactionDTO } from 'src/DTOs/ITransactionDTO';
import { TransactionsService } from './transactions.service';

@Controller('/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Query() query) {
    return this.transactionsService.getUserTransactions(query);
  }

  @Post()
  async createUser(@Body() input: ITransactionDTO) {
    return this.transactionsService.createTransaction(input);
  }
}
