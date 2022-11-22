import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { client } from '../prisma/client';

@Injectable()
export class AccountService {
  constructor(@Inject(CACHE_MANAGER) private cachemanager: Cache) {}

  async getUserBalance(userId: number) {
    const cacheKey = `balance${userId}`;
    let cachedBalance = await this.cachemanager.get(cacheKey);

    if (!cachedBalance) {
      const user = await client.user.findUnique({
        where: { id: userId },
        include: {
          account: true,
        },
      });
      cachedBalance = user.account.balance;

      this.cachemanager.set(cacheKey, user.account.balance, 60 * 60 * 24);
    }

    return cachedBalance;
  }
}
