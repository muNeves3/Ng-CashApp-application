import { HttpException, Injectable } from '@nestjs/common';
import { Transactions } from '@prisma/client';
import { ITransactionDTO } from '../../DTOs/ITransactionDTO';
import { ITransactionsFilterDTO } from '../../DTOs/ITransactionsFilterDTO';
import { client } from '../prisma/client';

@Injectable()
export class TransactionsService {
  //constructor() {}

  async createTransaction({
    creditedAccountId,
    debitedAccountId,
    value,
  }: ITransactionDTO) {
    try {
      const transaction = await client.transactions.create({
        data: {
          value,
          creditedAccountId,
          debitedAccountId,
        },
      });

      const debitedAccount = await client.account.update({
        where: {
          id: debitedAccountId,
        },
        data: {
          balance: {
            decrement: value,
          },
        },
      });

      const creditedAccount = await client.account.update({
        where: {
          id: creditedAccountId,
        },
        data: {
          balance: {
            increment: value,
          },
        },
      });

      return { transaction, debitedAccount, creditedAccount };
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: new Error(error.message),
      });
    }
  }

  async getUserTransactions({
    cashIn,
    cashOut,
    createdAt,
    userId,
  }: ITransactionsFilterDTO) {
    const userAccountId = await client.user.findUnique({
      where: { id: Number(userId) },
      include: {
        account: true,
      },
    });

    const allTransactions = await client.transactions.findFirst();
    if (!allTransactions) {
      throw new HttpException(
        'Você não é capaz de visualizar suas transações financeiras',
        400,
      );
    }

    if (cashIn) {
      const transactions = await client.transactions.findMany({
        where: {
          creditedAccountId: userAccountId.account.id,
        },
      });
      return transactions;
    } else if (cashOut) {
      const transactions = await client.transactions.findMany({
        where: {
          debitedAccountId: userAccountId.account.id,
        },
      });
      return transactions;
    } else if (createdAt) {
      console.log(new Date(createdAt));
      const string = `
      SELECT
        *, to_char("createdAt"::date, 'dd/mm/yyyy HH:mm') createdAtFormatted 
      FROM
        "Transactions"
      WHERE
      TO_CHAR("createdAt"::date, 'dd/mm/yyyy') = TO_CHAR('${createdAt}'::date, 'dd/mm/yyyy')
        AND ("creditedAccountId" = ${userAccountId.account.id}
        OR "debitedAccountId" = ${userAccountId.account.id})
    `;
      console.log(string);

      const transactions = await client.$queryRawUnsafe<Transactions>(string);

      return transactions;
    }
  }
}
