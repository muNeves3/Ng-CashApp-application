import { HttpException, Injectable } from '@nestjs/common';
import { Transactions } from '@prisma/client';
import { ICreateTransactionDTO } from 'src/DTOs/ICreateTransactionDTO';
import { ITransactionDTO } from '../../DTOs/ITransactionDTO';
import { ITransactionsFilterDTO } from '../../DTOs/ITransactionsFilterDTO';
import { client } from '../prisma/client';

@Injectable()
export class TransactionsService {
  //constructor() {}

  async createTransaction({
    creditedAccountUsername,
    debitedAccountId,
    value,
    userId,
  }: ICreateTransactionDTO) {
    try {
      const user = await client.user.findUnique({
        where: { id: userId },
      });

      if (user.username === creditedAccountUsername) {
        throw new HttpException(
          'Você não pode mandar dinheiro para você mesmo',
          400,
          {
            cause: new Error('Você não pode mandar dinheiro para você mesmo'),
          },
        );
      }
      const creditedAccountIdByUsername = await client.user.findUnique({
        where: {
          username: creditedAccountUsername,
        },
      });

      if (!creditedAccountIdByUsername) {
        throw new HttpException('Conta de destino não existe', 400, {
          cause: new Error('Conta de destino não existe'),
        });
      }

      const transaction = await client.transactions.create({
        data: {
          value,
          creditedAccountId: creditedAccountIdByUsername.accountId,
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
          id: creditedAccountIdByUsername.accountId,
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
    fromDate,
    toDate,
    userId,
    userAccountId,
  }: ITransactionsFilterDTO) {
    console.log(cashIn, cashOut, fromDate, toDate, userId, userAccountId);

    const allTransactions = await client.transactions.findFirst();
    if (!allTransactions) {
      throw new HttpException(
        'Você não é capaz de visualizar suas transações financeiras',
        400,
      );
    }

    if (cashIn) {
      let string = `
      SELECT "U1"."username" as "para", "U2"."username" as "de", "T"."id" as "TransactionId", * FROM "Transactions" "T"
        INNER JOIN "User" "U1" ON "U1"."accountId" = "T"."creditedAccountId"
        INNER JOIN "User" "U2" ON "U2"."accountId" = "T"."debitedAccountId"
        WHERE "T"."creditedAccountId" = ${userAccountId}
      `;

      if (toDate && fromDate) {
        string += ` AND TO_CHAR("createdAt"::date, 'dd/mm/yyyy') BETWEEN  TO_CHAR('${fromDate}'::date, 'dd/mm/yyyy') 
          AND TO_CHAR('${toDate}'::date, 'dd/mm/yyyy')`;
      } else if (fromDate && !toDate) {
        string += ` AND TO_CHAR("createdAt"::date, 'dd/mm/yyyy') >= TO_CHAR('${fromDate}'::date, 'dd/mm/yyyy')`;
      }
      const transactions = await client.$queryRawUnsafe<Transactions>(string);

      return transactions;
    } else if (cashOut) {
      let string = `
      SELECT "U1"."username" as "para", "U2"."username" as "de", "T"."id" as "TransactionId", * FROM "Transactions" "T"
      INNER JOIN "User" "U1" ON "U1"."accountId" = "T"."creditedAccountId"
      INNER JOIN "User" "U2" ON "U2"."accountId" = "T"."debitedAccountId"
      WHERE "T"."debitedAccountId" = ${userAccountId}
    `;

      if (toDate && fromDate) {
        string += ` AND TO_CHAR("createdAt"::date, 'dd/mm/yyyy') BETWEEN  TO_CHAR('${fromDate}'::date, 'dd/mm/yyyy') 
        AND TO_CHAR('${toDate}'::date, 'dd/mm/yyyy')`;
      } else if (fromDate && !toDate) {
        string += ` AND TO_CHAR("createdAt"::date, 'dd/mm/yyyy') >= TO_CHAR('${fromDate}'::date, 'dd/mm/yyyy')`;
      }
      console.log(string);

      const transactions = await client.$queryRawUnsafe<Transactions>(string);

      return transactions;
    }

    //   console.log(new Date(createdAt));
    //   const string = `
    //   SELECT
    //     *, to_char("createdAt"::date, 'dd/mm/yyyy HH:mm') createdAtFormatted
    //   FROM
    //     "Transactions"
    //   WHERE
    //   TO_CHAR("createdAt"::date, 'dd/mm/yyyy') = TO_CHAR('${createdAt}'::date, 'dd/mm/yyyy')
    //     AND ("creditedAccountId" = ${userAccountId.account.id}
    //     OR "debitedAccountId" = ${userAccountId.account.id})
    // `;
    //   console.log(string);
  }
}
