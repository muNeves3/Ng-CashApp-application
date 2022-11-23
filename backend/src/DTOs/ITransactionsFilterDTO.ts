export interface ITransactionsFilterDTO {
  cashIn: boolean;
  cashOut: boolean;
  fromDate: Date;
  toDate: Date;
  userId: number;
  userAccountId: number;
}
