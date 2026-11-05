// src/modules/stats/stats.service.ts
import { Prisma } from "../../../generated/prisma/client";
import { PaymentStatus, RequestStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const months = () =>
  Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    d.setMonth(d.getMonth() - (5 - i));
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }), start: d };
  });

const bucket = (rows: { date: Date; value: number }[]) =>
  months().map((m) => ({
    month: m.label,
    value: Math.round(
      rows.filter((r) => `${r.date.getFullYear()}-${r.date.getMonth()}` === m.key)
          .reduce((s, r) => s + r.value, 0) * 100
    ) / 100,
  }));

// Simple statistical insights + anomaly detection (z-score)
const insightsFor = (label: string, series: { value: number }[]) => {
  const out: string[] = [];
  const last = series.at(-1)?.value ?? 0;
  const prev = series.at(-2)?.value ?? 0;
  const history = series.slice(0, -1).map((s) => s.value);
  const mean = history.reduce((a, b) => a + b, 0) / (history.length || 1);
  const sd = Math.sqrt(history.reduce((a, b) => a + (b - mean) ** 2, 0) / (history.length || 1));
  if (prev > 0) {
    const pct = Math.round(((last - prev) / prev) * 100);
    if (pct !== 0) out.push(`${label} ${pct > 0 ? "rose" : "fell"} ${Math.abs(pct)}% compared with last month.`);
  }
  if (sd > 0 && Math.abs(last - mean) > 2 * sd)
    out.push(`Unusual activity: ${label.toLowerCase()} this month (${last}) is far from the recent average (${mean.toFixed(1)}).`);
  return out;
};

const getPublicStatsDB = async () => {
  const [totalProperties, totalTenants, totalLandlords, ratingAgg, cities, categories, reviews, rentedCount] =
    await Promise.all([
      prisma.property.count({ where: { available: true } }),
      prisma.user.count({ where: { role: Role.TENANT } }),
      prisma.user.count({ where: { role: Role.LANDLORD } }),
      prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
      prisma.property.groupBy({ by: ["city", "state"], _count: { _all: true }, orderBy: { _count: { city: "desc" } }, take: 6 }),
      prisma.category.findMany({ select: { id: true, name: true, _count: { select: { properties: true } } } }),
      prisma.review.findMany({
        where: { comment: { not: null }, rating: { gte: 4 } },
        orderBy: { createdAt: "desc" }, take: 6,
        select: { id: true, rating: true, comment: true,
          tenant: { select: { name: true } },
          property: { select: { id: true, title: true, city: true } } },
      }),
      prisma.rentalRequest.count({ where: { status: { in: [RequestStatus.ACTIVE, RequestStatus.COMPLETED] } } }),
    ]);

  return {
    totalProperties, totalTenants, totalLandlords, rentedCount,
    totalReviews: ratingAgg._count,
    avgRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
    cities: cities.map((c) => ({ city: c.city, state: c.state, count: c._count._all })),
    categories: categories.map((c) => ({ id: c.id, name: c.name, count: c._count.properties })),
    reviews,
  };
};

const getDashboardStatsDB = async (user: { id: string; role: Role }) => {
  const since = months()[0].start;
  const { id, role } = user;

  const requestWhere: Prisma.RentalRequestWhereInput =
    role === Role.ADMIN ? {} : role === Role.LANDLORD ? { property: { landlordId: id } } : { tenantId: id };
  const paymentWhere: Prisma.PaymentWhereInput =
    role === Role.ADMIN ? {} : role === Role.LANDLORD ? { rentalRequest: { property: { landlordId: id } } } : { userId: id };

  const [status, requests, payments, paidAgg] = await Promise.all([
    prisma.rentalRequest.groupBy({ by: ["status"], where: requestWhere, _count: { _all: true } }),
    prisma.rentalRequest.findMany({ where: { ...requestWhere, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.payment.findMany({
      where: { ...paymentWhere, status: PaymentStatus.COMPLETED, paidAt: { gte: since } },
      select: { paidAt: true, amount: true },
    }),
    prisma.payment.aggregate({ where: { ...paymentWhere, status: PaymentStatus.COMPLETED }, _sum: { amount: true } }),
  ]);

  let extra: { title: string; data: { name: string; value: number }[] } | null = null;
  if (role === Role.ADMIN) {
    const cats = await prisma.category.findMany({ select: { name: true, _count: { select: { properties: true } } } });
    extra = { title: "Properties by category", data: cats.map((c) => ({ name: c.name, value: c._count.properties })) };
  } else if (role === Role.LANDLORD) {
    const props = await prisma.property.findMany({
      where: { landlordId: id }, take: 6, orderBy: { rentals: { _count: "desc" } },
      select: { title: true, _count: { select: { rentals: true } } },
    });
    extra = { title: "Requests per property", data: props.map((p) => ({ name: p.title.slice(0, 18), value: p._count.rentals })) };
  }

  const requestsByMonth = bucket(requests.map((r) => ({ date: r.createdAt, value: 1 })));
  const moneyByMonth = bucket(payments.map((p) => ({ date: p.paidAt!, value: Number(p.amount) })));
  const moneyLabel = role === Role.TENANT ? "Rent paid" : role === Role.LANDLORD ? "Earnings" : "Revenue";

  return {
    statusBreakdown: status.map((s) => ({ name: s.status, value: s._count._all })),
    requestsByMonth, moneyByMonth, moneyLabel,
    totalMoney: Number(paidAgg._sum.amount ?? 0),
    extra,
    insights: [...insightsFor("Rental requests", requestsByMonth), ...insightsFor(moneyLabel, moneyByMonth)],
  };
};

export const statsService = { getPublicStatsDB, getDashboardStatsDB };