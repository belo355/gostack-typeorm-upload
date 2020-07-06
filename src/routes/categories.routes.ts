import { Router } from "express";
import { getCustomRepository } from "typeorm";

import CategoryRepository from "../repositories/CategoryRepository";
import CreateCategoryService from "../services/CreateCategoryService";
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const categoriesRouter = Router();

categoriesRouter.get("/", async (request, response) => {
  const cateogryRepository = getCustomRepository(CategoryRepository);
  const categories = await cateogryRepository.find();

  return response.status(200).json(categories);
});

categoriesRouter.post("/", async (request, response) => {
  const { title } = request.body;
  const createCategoryService = new CreateCategoryService();

  const category = await createCategoryService.execute({
    title,
  });

  return response.json(category);
});

// categoriesRouter.delete("/:id", async (request, response) => {
//   // TODO
// });

// categoriesRouter.post("/import", async (request, response) => {
//   // TODO
// });

export default categoriesRouter;
