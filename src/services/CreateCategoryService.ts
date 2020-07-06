import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";

import CategoryRepository from "../repositories/CategoryRepository";
import Category from "../models/Category";

interface RequestDTO {
  title: string;
}
class CreateCategoryService {
  public async execute({ title }: RequestDTO): Promise<Category | null> {
    const categoriesRepository = getCustomRepository(CategoryRepository);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title },
    });

    if (checkCategoryExists) {
      throw new AppError("category exists", 400);
    }

    const category = await categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(category);
    return category;
  }
}

export default CreateCategoryService;
