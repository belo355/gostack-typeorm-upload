import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";

import Transaction from "../models/Transaction";
import TransactionsRepository from "../repositories/TransactionsRepository";
import CategoryRepository from "../repositories/CategoryRepository";

interface RequestDTO {
  title: string;
  value: number;
  type: string;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoryRepository);

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      throw new AppError("category not exists", 400);
    }

    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryExists.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
