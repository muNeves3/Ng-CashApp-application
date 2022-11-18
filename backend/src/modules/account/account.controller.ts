import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ITransactionDTO } from 'src/DTOs/ITransactionDTO';
import { AccountService } from './account.service';

@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/balance')
  async getBalance(@Query('userId') userId: number) {
    return this.accountService.getUserBalance(Number(userId));
  }
}
