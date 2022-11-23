import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ICreateTransactionDTO } from 'src/DTOs/ICreateTransactionDTO';
import { TransactionsService } from './transactions.service';

@Controller('/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Query() body) {
    return this.transactionsService.getUserTransactions(body);
  }

  @Post()
  async createTransaction(@Body() input: ICreateTransactionDTO) {
    return this.transactionsService.createTransaction(input);
  }
}
