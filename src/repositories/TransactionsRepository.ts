import { EntityRepository, Repository } from "typeorm";

import Transaction from "../models/Transaction";

interface Balance {
  income: number;
  outcome: number;
  result: number;
}

// TODO: regularizar balance
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  // public async getBalance(): Promise<Balance> {
  //   const sumIncome = await this.createQueryBuilder()
  //     .select("SUM(value)")
  //     .where("type= 'income'")
  //     .getRawOne();
  //   const sumOutcome = await this.createQueryBuilder()
  //     .select("SUM(value)")
  //     .where("type= 'outcome'")
  //     .getRawOne();
  //   const total = Number(sumIncome) - Number(sumOutcome);
  //   console.log(total);
  //   return {
  //     income: sumIncome,
  //     outcome: sumOutcome,
  //     result: total,
  //   };
  // }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case "income":
            accumulator.income += Number(transaction.value);
            break;
          case "outcome":
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      }
    );
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
