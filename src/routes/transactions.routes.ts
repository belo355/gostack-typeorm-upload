import { Router } from "express";
import { getCustomRepository } from "typeorm";
import multer from "multer";

import TransactionsRepository from "../repositories/TransactionsRepository";
import CategoryRepository from "../repositories/CategoryRepository";
import CreateTransactionService from "../services/CreateTransactionService";
import DeleteTransactionService from "../services/DeleteTransactionService";
import ImportTransactionsService from "../services/ImportTransactionsService";

import uploadConfig from "../config/upload";

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get("/", async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const categoryRepository = getCustomRepository(CategoryRepository)
  const transactions = await transactionRepository.getBalance();
  // const category = await categoryRepository.findOne(transactions.category_id);

  // const transactionCategory = concat(transactions, category);

  return response.status(200).json(transactions);
});

transactionsRouter.post("/", async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

// TODO: FINALIZAR CHAMADA HTTP DELETE
transactionsRouter.delete("/", async (request, response) => {
  const { id } = request.body;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute({ id });

  return response.status(200).json({ ok: true });
});

transactionsRouter.post(
  "/import",
  upload.single("file"),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.status(200).json(transactions);
  }
);

export default transactionsRouter;
