import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { ITransactionDTO } from 'src/DTOs/ITransactionDTO';
import { client } from '../prisma/client';

@Injectable()
export class AccountService {
  //constructor() {}

  async getUserBalance(userId: number) {
    const user = await client.user.findUnique({
      where: { id: userId },
      include: {
        account: true,
      },
    });

    return user.account.balance;
  }
}
