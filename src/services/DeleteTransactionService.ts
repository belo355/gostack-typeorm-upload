// import AppError from '../errors/AppError';
import { getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface RequestDTO {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    try {
      await transactionsRepository.delete(id);
    } catch (error) {
      throw new Error("transaction not exists");
    }
  }
}

export default DeleteTransactionService;
