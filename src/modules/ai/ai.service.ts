// src/modules/ai/ai.service.ts
import Anthropic from "@anthropic-ai/sdk";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";

const client = new Anthropic({ apiKey: config.anthropic_api_key });
type Msg = { role: "user" | "assistant"; content: string };

const text = (msg: Anthropic.Message) =>
  msg.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");

// Feature 1: natural-language search -> filters
const parseSearchQuery = async (query: string) => {
  const [cats, cities] = await Promise.all([
    prisma.category.findMany({ select: { name: true } }),
    prisma.property.findMany({ distinct: ["city"], select: { city: true } }),
  ]);
  const msg = await client.messages.create({
    model: config.ai_model,
    max_tokens: 300,
    system:
      `Convert a rental search request into JSON filters. Reply with JSON only, no prose. ` +
      `Allowed keys (omit unknown ones): q, city, category, minPrice, maxPrice, bedrooms, minRating, sort. ` +
      `category must be one of: ${cats.map((c) => c.name).join(", ")}. ` +
      `city should be one of: ${cities.map((c) => c.city).join(", ")}. ` +
      `sort is one of: price_low, price_high, newest, rating. Use "q" only for leftover keywords.`,
    messages: [{ role: "user", content: query.slice(0, 300) }],
  });
  try {
    const raw = JSON.parse(text(msg).replace(/```json|```/g, "").trim());
    const allowed = ["q", "city", "category", "minPrice", "maxPrice", "bedrooms", "minRating", "sort"];
    return Object.fromEntries(
      Object.entries(raw).filter(([k, v]) => allowed.includes(k) && v !== null && v !== "")
        .map(([k, v]) => [k, String(v)])
    );
  } catch {
    return { q: query };
  }
};

// Feature 2: chat assistant grounded in live listings
const chat = async (messages: Msg[]) => {
  const props = await prisma.property.findMany({
    where: { available: true }, take: 20, orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: { id: true, title: true, city: true, state: true, price: true, bedrooms: true, bathrooms: true,
              category: { select: { name: true } } },
  });
  const catalog = props.map((p) =>
    `- ${p.title} | ${p.category.name} | ${p.city}, ${p.state} | $${Number(p.price)}/mo | ${p.bedrooms ?? 0}bd/${p.bathrooms ?? 0}ba | /properties/${p.id}`
  ).join("\n");

  const msg = await client.messages.create({
    model: config.ai_model,
    max_tokens: 500,
    system:
      `You are RentNest's assistant. Be concise and friendly. How the platform works: tenants send a rental request ` +
      `(move-in date + message); the landlord approves or rejects it; once approved the tenant pays the first month ` +
      `via Stripe Checkout and the rental becomes ACTIVE; after completion the tenant can leave a review. ` +
      `Only recommend listings from this catalog and write each listing's link exactly as /properties/<id>:\n${catalog}\n` +
      `If you don't know something, say so and suggest the Contact page.`,
    messages,
  });
  return text(msg);
};

export const aiService = { parseSearchQuery, chat };