export interface ICreateTransactionDTO {
  debitedAccountId: number;
  creditedAccountUsername: string;
  value: number;
  userId: number;
}
