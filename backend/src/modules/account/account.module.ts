import { Module, NestModule } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated.middleware';
@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(EnsureAuthenticatedMiddleware).forRoutes(AccountController);
  }
}
