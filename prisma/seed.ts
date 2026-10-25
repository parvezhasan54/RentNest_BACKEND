import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { Role } from "../generated/prisma/enums";

const PASSWORD = "Demo@1234";

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80`;
const POOL = [
  "1568605114967-8130f3a36994",
  "1502672260266-1c1ef2d93688",
  "1560448204-e02f11c3d0e2",
  "1522708323590-d24dbb6b0267",
  "1493809842364-78817add7ffb",
  "1512917774080-9991f1c4c750",
];
const imagesFor = (i: number) =>
  [0, 1, 2].map((k) => IMG(POOL[(i + k) % POOL.length]));

const categories = ["Apartment", "House", "Condo", "Studio", "Townhouse"];

const users = [
  { name: "Demo Admin", email: "admin@rentnest.com", role: Role.ADMIN },
  { name: "Demo Landlord", email: "landlord@rentnest.com", role: Role.LANDLORD },
  { name: "Demo Tenant", email: "tenant@rentnest.com", role: Role.TENANT },
];

// Fictional addresses for demo data.
const properties = [
  { title: "Sunlit 2-Bed near Downtown Austin", city: "Austin", state: "TX", neighborhood: "East Austin", address: "412 Cesar Chavez St", category: "Apartment", price: 1850, bedrooms: 2, bathrooms: 2, sqft: 980, featured: true, amenities: ["Wifi", "Parking", "Gym", "AC"], description: "Bright corner unit with floor-to-ceiling windows, in-unit laundry and a short walk to the riverfront trail." },
  { title: "Family House with Backyard", city: "Austin", state: "TX", neighborhood: "Mueller", address: "27 Barbara Jordan Blvd", category: "House", price: 2900, bedrooms: 4, bathrooms: 3, sqft: 2100, featured: true, amenities: ["Garden", "Parking", "Pets", "AC"], description: "Four bedrooms, a fenced yard and a double garage on a quiet street near parks and schools." },
  { title: "Modern Loft in River North", city: "Chicago", state: "IL", neighborhood: "River North", address: "620 N Wells St", category: "Apartment", price: 2300, bedrooms: 1, bathrooms: 1, sqft: 850, featured: true, amenities: ["Wifi", "Gym", "Security"], description: "Exposed-brick loft with 12-foot ceilings, a doorman and a rooftop terrace with skyline views." },
  { title: "Lakeview Garden Condo", city: "Chicago", state: "IL", neighborhood: "Lakeview", address: "3150 N Sheffield Ave", category: "Condo", price: 1950, bedrooms: 2, bathrooms: 1, sqft: 900, featured: false, amenities: ["Parking", "Pets", "AC"], description: "Ground-floor condo with a private patio, two blocks from the lakefront and the Brown Line." },
  { title: "Brooklyn Brownstone Studio", city: "New York", state: "NY", neighborhood: "Park Slope", address: "88 7th Ave", category: "Studio", price: 2400, bedrooms: 0, bathrooms: 1, sqft: 480, featured: true, amenities: ["Wifi", "Security"], description: "Renovated studio in a classic brownstone, steps from Prospect Park and three subway lines." },
  { title: "Upper West Side 1-Bed", city: "New York", state: "NY", neighborhood: "Upper West Side", address: "310 W 84th St", category: "Apartment", price: 3400, bedrooms: 1, bathrooms: 1, sqft: 700, featured: false, amenities: ["Wifi", "Security", "Gym", "AC"], description: "Pre-war building with a renovated kitchen, hardwood floors and a live-in super." },
  { title: "Capitol Hill Townhouse", city: "Seattle", state: "WA", neighborhood: "Capitol Hill", address: "1420 E Pine St", category: "Townhouse", price: 3100, bedrooms: 3, bathrooms: 2, sqft: 1600, featured: true, amenities: ["Parking", "Garden", "Pets"], description: "Three-level townhouse with a rooftop deck and a garage, a short walk to cafes and light rail." },
  { title: "South Lake Union Condo", city: "Seattle", state: "WA", neighborhood: "South Lake Union", address: "901 Fairview Ave N", category: "Condo", price: 2650, bedrooms: 2, bathrooms: 2, sqft: 1050, featured: false, amenities: ["Wifi", "Gym", "Pool", "Security"], description: "Corner condo with lake views, building gym and pool, and secure parking included." },
  { title: "Denver Craftsman Bungalow", city: "Denver", state: "CO", neighborhood: "Highlands", address: "3622 Tejon St", category: "House", price: 2750, bedrooms: 3, bathrooms: 2, sqft: 1500, featured: false, amenities: ["Garden", "Parking", "Pets"], description: "Restored 1920s bungalow with original woodwork, a modern kitchen and a large front porch." },
  { title: "Wynwood Art District Studio", city: "Miami", state: "FL", neighborhood: "Wynwood", address: "250 NW 24th St", category: "Studio", price: 1700, bedrooms: 0, bathrooms: 1, sqft: 520, featured: false, amenities: ["Wifi", "Pool", "AC"], description: "Compact studio in a boutique building with a pool deck, surrounded by galleries and restaurants." },
  { title: "Back Bay Classic 2-Bed", city: "Boston", state: "MA", neighborhood: "Back Bay", address: "175 Marlborough St", category: "Apartment", price: 3600, bedrooms: 2, bathrooms: 1, sqft: 950, featured: false, amenities: ["Wifi", "Security", "AC"], description: "Elegant brownstone apartment with bay windows and a working fireplace, near the Public Garden." },
  { title: "Pacific Beach Ocean Condo", city: "San Diego", state: "CA", neighborhood: "Pacific Beach", address: "1120 Garnet Ave", category: "Condo", price: 3200, bedrooms: 2, bathrooms: 2, sqft: 1000, featured: true, amenities: ["Pool", "Parking", "AC", "Security"], description: "Beachside condo with a balcony, shared pool and assigned parking, a block from the boardwalk." },
];

const reviews = [
  { rating: 5, comment: "Exactly as described. The landlord answered every question within a day." },
  { rating: 4, comment: "Great location and very quiet. Parking was easy and the move-in was smooth." },
  { rating: 5, comment: "Spotless, bright, and the amenities were all in working order." },
  { rating: 4, comment: "Solid place for the price. Would rent here again." },
];

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  const userIds: Record<string, string> = {};
  for (const u of users) {
    const row = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: hash },
    });
    userIds[u.role] = row.id;
  }

  const categoryIds: Record<string, string> = {};
  for (const name of categories) {
    const row = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryIds[name] = row.id;
  }

  const existing = await prisma.property.count({
    where: { landlordId: userIds[Role.LANDLORD] },
  });
  if (existing === 0) {
    for (const [i, p] of properties.entries()) {
      const review = reviews[i];
      const { category, ...rest } = p;
      const created = await prisma.property.create({
        data: {
          ...rest,
          location: `${p.address}, ${p.neighborhood}, ${p.city}, ${p.state}`,
          images: imagesFor(i),
          available: true,
          rating: review?.rating ?? 0,
          reviewCount: review ? 1 : 0,
          landlordId: userIds[Role.LANDLORD],
          categoryId: categoryIds[category],
        },
      });
      if (review) {
        await prisma.review.create({
          data: { ...review, propertyId: created.id, tenantId: userIds[Role.TENANT] },
        });
      }
    }
  }

  console.log(`Seed complete. Demo logins use password: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());