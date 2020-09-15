import { EntityRepository, Repository } from "typeorm";

import Transaction from "../models/Transaction";

interface Balance {
  transactions: Repository<Transaction>;
  category_id: string;
  income: number;
  outcome: number;
  total: number;
}

// TODO: regularizar balance
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async transactions(): Promise<Balance> {
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
        transactions,
        income: 0,
        outcome: 0,
        total: 0,
      }
    );
    const total = income - outcome;
    return {
      transactions,
      income,
      outcome,
      total,
    };
  }

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
        transactions,
        income: 0,
        outcome: 0,
        total: 0,
      }
    );
    const total = income - outcome;
    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
