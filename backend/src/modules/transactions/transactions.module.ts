import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated.middleware';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(EnsureAuthenticatedMiddleware)
      .forRoutes(TransactionsController);
  }
}
