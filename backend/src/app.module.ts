import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account/account.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, TransactionsModule, AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
