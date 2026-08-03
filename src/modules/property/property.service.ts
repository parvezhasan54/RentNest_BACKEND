import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";           // ADD
import HttpsStatus from "http-status-codes";    

const getAllPropertiesFromDB = async (
    queryParams: {
        city?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        page?: string;
        limit?: string;
    }
) => {

    const {
        city,
        category,
        minPrice,
        maxPrice,
        sort,
        page = "1",
        limit = "9",
    } = queryParams;

    const currentPage = Math.max(1, Number(page) || 1);
    const isAll = limit === "all";
    const pageLimit:number|undefined = isAll ? undefined : Math.max(1, Number(limit) || 9);
    const skip = isAll ? undefined : (currentPage - 1) * pageLimit!;
    const where: Prisma.PropertyWhereInput = {
        ...(city && {
            city: {
                contains: city,
                mode: Prisma.QueryMode.insensitive,
            },
        }),

        ...(minPrice || maxPrice
            ? {
                price: {
                    ...(minPrice && {
                        gte: new Prisma.Decimal(minPrice),
                    }),
                    ...(maxPrice && {
                        lte: new Prisma.Decimal(maxPrice),
                    }),
                },
            }
            : {}),

        ...(category && {
            category: {
                name: {
                    equals: category,
                    mode: Prisma.QueryMode.insensitive,
                },
            },
        }),
    };



    const [result, total] = await Promise.all([
        prisma.property.findMany({
            where,

            skip,
            take: pageLimit,

            orderBy:
                sort === "price_low"
                    ? { price: "asc" }
                    : sort === "price_high"
                        ? { price: "desc" }
                        : sort === "newest"
                            ? { createdAt: "desc" }
                            : undefined,

            include: {
                category: true,
                landlord: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),

        prisma.property.count({ where }),
    ]);


    return {
        data: result,
        meta: {
            page: currentPage,
            limit: isAll ? total : pageLimit,
            total,
            totalPage: isAll ? 1 : Math.ceil(total / pageLimit!),
        },
    };

};

const getPropertyByIdFromDB = async (propertyId: string) => {
  const result = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
 
  if (!result) return null;
 
  return {
    ...result,
    price: Number(result.price),
  };
};

const savePropertyDB = async (propertyId: string, userId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(HttpsStatus.NOT_FOUND, "Property not found");
  }

  const existing = await prisma.savedProperty.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) return existing;

  return prisma.savedProperty.create({
    data: { userId, propertyId },
  });
};

const unsavePropertyDB = async (propertyId: string, userId: string) => {
  await prisma.savedProperty.deleteMany({
    where: { userId, propertyId },
  });
  return { propertyId };
};

const getSavedPropertiesFromDB = async (userId: string) => {
  const saved = await prisma.savedProperty.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          category: true,
          landlord: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return saved.map((s) => ({
    ...s.property,
    price: Number(s.property.price),
  }));
};

export const propertyService = {
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
  savePropertyDB,          // ADD
  unsavePropertyDB,        // ADD
  getSavedPropertiesFromDB // ADD
};