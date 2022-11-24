export interface ITransactionsFilterDTO {
  cashIn: string;
  cashOut: string;
  fromDate: Date;
  toDate: Date;
  userId: number;
  userAccountId: number;
}
