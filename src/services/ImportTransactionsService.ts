import { getCustomRepository, In } from "typeorm";
import csvParse from "csv-parse";
import fs from "fs";
import Transaction from "../models/Transaction";
import CategoryRepository from "../repositories/CategoryRepository";
import TransactionsRepository from "../repositories/TransactionsRepository";
import Category from "../models/Category";

interface CSVTransaction {
  title: string;
  type: "income" | "outcome";
  value: number;
  category: string;
}
class ImportTransactionsService {
  public async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getCustomRepository(CategoryRepository);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      delimiter: ",",
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on("data", async (line) => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise((resolve) => parseCSV.on("end", resolve));

    // buscar categorias existentes  (bookCategories)
    const existentsCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentsCategoriesTitle = existentsCategories.map(
      (category: Category) => category.title
    );

    const addOthersCategoryTitle = categories
      .filter((category) => !existentsCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index); // remove duplicate categories

    const newsCategories = categoriesRepository.create(
      addOthersCategoryTitle.map((title) => ({
        title,
      }))
    );

    categoriesRepository.save(newsCategories);

    // mapper full categories, and create transactions
    const finalCategories = [...newsCategories, ...existentsCategories];

    const createdTrasactions = transactionsRepository.create(
      transactions.map((transaction) => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          (category) => category.title === transaction.category
        ),
      }))
    );

    await transactionsRepository.save(createdTrasactions);

    await fs.promises.unlink(filePath);

    return createdTrasactions;
  }
}

export default ImportTransactionsService;
