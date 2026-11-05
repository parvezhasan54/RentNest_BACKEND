
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

const getAllPropertiesFromDB = async (queryParams: {
    q?: string;
    city?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    minRating?: string;
    featured?: string;
    sort?: string;
    page?: string;
    limit?: string;
}) => {
    const {
        q,
        city,
        category,
        minPrice,
        maxPrice,
        bedrooms,
        minRating,
        featured,
        sort,
        page = "1",
        limit = "9",
    } = queryParams;

    const currentPage = Math.max(1, Number(page) || 1);
    const isAll = limit === "all";
    const pageLimit: number | undefined = isAll
        ? undefined
        : Math.max(1, Number(limit) || 9);
    const skip = isAll ? undefined : (currentPage - 1) * pageLimit!;
    const insensitive = Prisma.QueryMode.insensitive;

    const where: Prisma.PropertyWhereInput = {
        ...(q && {
            OR: [
                { title: { contains: q, mode: insensitive } },
                { city: { contains: q, mode: insensitive } },
                { neighborhood: { contains: q, mode: insensitive } },
                { address: { contains: q, mode: insensitive } },
                { description: { contains: q, mode: insensitive } },
            ],
        }),
        ...(city && {
            city: { contains: city, mode: insensitive },
        }),
        ...(category && {
            category: {
                name: { equals: category, mode: insensitive },
            },
        }),
        ...(bedrooms && {
            bedrooms: bedrooms === "4"
                ? { gte: 4 }
                : Number(bedrooms),
        }),
        ...(minRating && {
            rating: { gte: Number(minRating) },
        }),
        ...(featured === "true" && {
            featured: true,
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
    };

    const orderBy: Prisma.PropertyOrderByWithRelationInput[] =
        sort === "price_low"
            ? [{ price: "asc" }]
            : sort === "price_high"
              ? [{ price: "desc" }]
              : sort === "newest"
                ? [{ createdAt: "desc" }]
                : sort === "rating"
                  ? [{ rating: "desc" }, { reviewCount: "desc" }]
                  : [{ featured: "desc" }, { createdAt: "desc" }];

    const [result, total] = await Promise.all([
        prisma.property.findMany({
            where,
            skip,
            take: pageLimit,
            orderBy,
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
        data: result.map((property) => ({
            ...property,
            price: Number(property.price),
        })),
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
        where: { id: propertyId },
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
            reviews: {
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
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
        where: {
            userId_propertyId: {
                userId,
                propertyId,
            },
        },
    });

    if (existing) return existing;

    return prisma.savedProperty.create({
        data: {
            userId,
            propertyId,
        },
    });
};

const unsavePropertyDB = async (propertyId: string, userId: string) => {
    await prisma.savedProperty.deleteMany({
        where: {
            userId,
            propertyId,
        },
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
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return saved.map((s) => ({
        ...s.property,
        price: Number(s.property.price),
    }));
};

// Search-as-you-type property suggestions
const getSuggestionsFromDB = async (q: string) => {
    const term = q.trim();

    if (term.length < 2) return [];

    const insensitive = Prisma.QueryMode.insensitive;

    const [cities, properties] = await Promise.all([
        prisma.property.findMany({
            where: {
                OR: [
                    { city: { contains: term, mode: insensitive } },
                    { neighborhood: { contains: term, mode: insensitive } },
                ],
            },
            distinct: ["city"],
            select: {
                city: true,
                state: true,
            },
            take: 4,
        }),
        prisma.property.findMany({
            where: {
                title: {
                    contains: term,
                    mode: insensitive,
                },
            },
            select: {
                id: true,
                title: true,
            },
            take: 4,
        }),
    ]);

    return [
        ...cities.map((city) => ({
            type: "city" as const,
            label: `${city.city}, ${city.state}`,
            value: city.city,
        })),
        ...properties.map((property) => ({
            type: "property" as const,
            label: property.title,
            value: property.id,
        })),
    ];
};

// Trending: ranks listings by real user activity
const getTrendingFromDB = async (limit = 4) => {
    const rows = await prisma.property.findMany({
        where: { available: true },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    savedBy: true,
                    rentals: true,
                },
            },
        },
    });

    return rows
        .map((property) => ({
            ...property,
            price: Number(property.price),
            trendScore:
                property._count.rentals * 3 +
                property._count.savedBy * 2 +
                property.reviewCount +
                property.rating * 2 +
                (property.featured ? 1 : 0),
        }))
        .sort((a, b) => b.trendScore - a.trendScore)
        .slice(0, limit)
        .map(({ _count, ...rest }) => rest);
};

export const propertyService = {
    getAllPropertiesFromDB,
    getPropertyByIdFromDB,
    savePropertyDB,
    unsavePropertyDB,
    getSavedPropertiesFromDB,
    getSuggestionsFromDB,
    getTrendingFromDB,
};
