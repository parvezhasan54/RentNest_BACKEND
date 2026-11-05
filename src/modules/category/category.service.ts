import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError";
const createCategoryInDB = async (payload: any) => {
    const result = await prisma.category.create({
        data: payload
    });
    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany();
    return result;
};

const deleteCategoryInDB = async (id: string) => {
  const used = await prisma.property.count({ where: { categoryId: id } });
  if (used > 0) throw new AppError(409, "Category is used by existing properties");
  return prisma.category.delete({ where: { id } });
};

export const categoryService = { createCategoryInDB, getAllCategoriesFromDB,deleteCategoryInDB }