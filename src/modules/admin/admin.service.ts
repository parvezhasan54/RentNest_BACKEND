
import { PropertyStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

interface IUserQuery {
    page: number;
    limit: number;
    role?: Role;
}

const getAllUserDB = async ({ page, limit, role }: IUserQuery) => {
    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            omit: {
                password: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: users,
    };
};

const updateUserStatusDB = async (
    id: string,
    payload: { isBanned: boolean }
) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not found");
    }

    if (user.role === Role.ADMIN) {
        throw new AppError(
            HttpsStatus.FORBIDDEN,
            "Admin user cannot be banned"
        );
    }

    const result = await prisma.user.update({
        where: { id },
        data: { isBanned: payload.isBanned },
    });

    return result;
};

const getAllPropertiesDB = async () => {
    const result = await prisma.property.findMany({
        include: {
            landlord: {
                omit: {
                    password: true,
                },
            },
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result.map((property) => ({
        ...property,
        price: Number(property.price),
    }));
};

const updatePropertyStatusDB = async (
    propertyId: string,
    payload: { status: PropertyStatus }
) => {
    const allowedStatuses = [
        PropertyStatus.AVAILABLE,
        PropertyStatus.UNAVAILABLE,
    ];

    if (!payload.status || !allowedStatuses.includes(payload.status)) {
        throw new AppError(
            HttpsStatus.BAD_REQUEST,
            "Invalid property status."
        );
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Property not found");
    }

    const result = await prisma.property.update({
        where: { id: propertyId },
        data: {
            status: payload.status,
            available: payload.status === PropertyStatus.AVAILABLE,
        },
    });

    return result;
};

const deletePropertyDB = async (propertyId: string) => {
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Property not found");
    }

    const result = await prisma.property.delete({
        where: { id: propertyId },
    });

    return result;
};

const getAllRentalsDB = async () => {
    const result = await prisma.rentalRequest.findMany({
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: true,
        },
    });

    return result;
};

const meanStd = (v: number[]) => {
    const n = v.length || 1;
    const mean = v.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(
        v.reduce((a, b) => a + (b - mean) ** 2, 0) / n
    );

    return { mean, std };
};

const getAnalyticsDB = async () => {
    const monthKey = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const months: string[] = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        months.push(monthKey(d));
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
        requests,
        users,
        properties,
        payments,
        statusGroups,
    ] = await Promise.all([
        prisma.rentalRequest.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                createdAt: true,
            },
        }),
        prisma.user.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                createdAt: true,
            },
        }),
        prisma.property.findMany({
            select: {
                id: true,
                title: true,
                city: true,
                price: true,
            },
        }),
        prisma.payment.findMany({
            where: {
                status: "COMPLETED",
                paidAt: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                amount: true,
                paidAt: true,
            },
        }),
        prisma.rentalRequest.groupBy({
            by: ["status"],
            _count: {
                _all: true,
            },
        }),
    ]);

    const monthly = months.map((m) => ({
        month: m,
        requests: requests.filter(
            (r) => monthKey(r.createdAt) === m
        ).length,
        users: users.filter(
            (u) => monthKey(u.createdAt) === m
        ).length,
        revenue: payments
            .filter((p) => p.paidAt && monthKey(p.paidAt) === m)
            .reduce((sum, p) => sum + Number(p.amount), 0),
    }));

    // Top cities by listing count
    const cityCount = new Map<string, number>();

    properties.forEach((p) => {
        cityCount.set(
            p.city,
            (cityCount.get(p.city) ?? 0) + 1
        );
    });

    const topCities = [...cityCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([city, count]) => ({ city, count }));

    // ---- Anomaly detection (z-score) ----
    const anomalies: {
        type: string;
        title: string;
        detail: string;
    }[] = [];

    // 1) Daily rental-request spikes over the last 30 days
    const days: string[] = [];

    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }

    const daily = days.map((day) =>
        requests.filter(
            (r) => r.createdAt.toISOString().slice(0, 10) === day
        ).length
    );

    const { mean: dMean, std: dStd } = meanStd(daily);

    if (dStd > 0) {
        daily.forEach((value, i) => {
            const z = (value - dMean) / dStd;

            if (z >= 2) {
                anomalies.push({
                    type: "request_spike",
                    title: `Unusual spike in rental requests on ${days[i]}`,
                    detail: `${value} requests vs a daily average of ${dMean.toFixed(1)}.`,
                });
            }
        });
    }

    // 2) Price outliers inside a city (needs 5+ listings to be meaningful)
    const byCity = new Map<
        string,
        { title: string; price: number }[]
    >();

    properties.forEach((p) => {
        const list = byCity.get(p.city) ?? [];

        list.push({
            title: p.title,
            price: Number(p.price),
        });

        byCity.set(p.city, list);
    });

    byCity.forEach((list, city) => {
        if (list.length < 5) return;

        const { mean, std } = meanStd(
            list.map((x) => x.price)
        );

        if (std === 0) return;

        list.forEach((x) => {
            const z = (x.price - mean) / std;

            if (Math.abs(z) >= 2) {
                anomalies.push({
                    type: "price_outlier",
                    title: `"${x.title}" is priced unusually ${z > 0 ? "high" : "low"} for ${city}`,
                    detail: `$${x.price.toLocaleString()} vs a city average of $${Math.round(mean).toLocaleString()}.`,
                });
            }
        });
    });

    // ---- Plain-language insights ----
    const insights: string[] = [];
    const last = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];

    if (prev && prev.requests > 0) {
        const pct = Math.round(
            ((last.requests - prev.requests) / prev.requests) * 100
        );

        insights.push(
            `Rental requests ${pct >= 0 ? "rose" : "fell"} ${Math.abs(pct)}% compared with last month.`
        );
    } else {
        insights.push(
            `${last.requests} rental requests were received this month.`
        );
    }

    if (topCities[0]) {
        insights.push(
            `${topCities[0].city} has the most listings (${topCities[0].count}).`
        );
    }

    if (last.revenue > 0) {
        insights.push(
            `Completed payments this month total $${last.revenue.toLocaleString()}.`
        );
    }

    return {
        monthly,
        statusBreakdown: statusGroups.map((g) => ({
            name: g.status,
            value: g._count._all,
        })),
        topCities,
        anomalies,
        insights,
    };
};

// Get all payments
const getAllPaymentsDB = async () => {
    const rows = await prisma.payment.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            rentalRequest: {
                include: {
                    property: {
                        select: {
                            title: true,
                        },
                    },
                },
            },
        },
    });

    return rows.map((p) => ({
        ...p,
        amount: Number(p.amount),
    }));
};

// Get all contact messages
const getMessagesDB = () =>
    prisma.contactMessage.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

export const adminService = {
    getAllUserDB,
    updateUserStatusDB,
    getAllPropertiesDB,
    updatePropertyStatusDB,
    deletePropertyDB,
    getAllRentalsDB,
    getAnalyticsDB,
    getAllPaymentsDB,
    getMessagesDB,
};
