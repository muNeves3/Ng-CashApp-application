import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { client } from '../prisma/client';

@Injectable()
export class AccountService {
  constructor(@Inject(CACHE_MANAGER) private cachemanager: Cache) {}

  async getUserBalance(userId: number) {
    const user = await client.user.findUnique({
      where: { id: userId },
      include: {
        account: true,
      },
    });
    const cachedBalance = user.account.balance;

    return cachedBalance;
  }
}
