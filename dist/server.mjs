var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cookieParser from "cookie-parser";
import express from "express";
import HttpsStatus20 from "http-status-codes";
import cors from "cors";
import path3 from "path";

// src/modules/user/user.route.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/user/user.service.ts
import { randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  port: process.env.PORT || 5e3,
  databaseUrl: process.env.DATABASE_URL,
  server_url: process.env.SERVER_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  anthropic_api_key: process.env.ANTHROPIC_API_KEY,
  ai_model: process.env.AI_MODEL || "claude-haiku-5-5"
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum Role {\n  TENANT\n  LANDLORD\n  ADMIN\n}\n\nenum RequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  ACTIVE\n  COMPLETED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n}\n\nenum PaymentProvider {\n  STRIPE\n  SSLCOMMERZ\n}\n\nenum PropertyStatus {\n  AVAILABLE\n  UNAVAILABLE\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n\n  properties Property[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel ContactMessage {\n  id        String   @id @default(uuid())\n  name      String\n  email     String\n  subject   String\n  message   String\n  createdAt DateTime @default(now())\n}\n\nmodel NewsletterSubscriber {\n  id        String   @id @default(uuid())\n  email     String   @unique\n  createdAt DateTime @default(now())\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  transactionId String @unique\n\n  amount Decimal @db.Decimal(10, 2)\n\n  provider PaymentProvider\n\n  status PaymentStatus @default(PENDING)\n\n  rentalRequestId String\n  rentalRequest   RentalRequest @relation(fields: [rentalRequestId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  paidAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Property {\n  id String @id @default(uuid())\n\n  title       String\n  description String\n\n  // Address\n  address      String\n  neighborhood String?\n  city         String\n  state        String\n  zipCode      String?\n  country      String  @default("USA")\n\n  // Coordinates (for maps & nearby search)\n  latitude  Float?\n  longitude Float?\n\n  // Display location\n  location String?\n\n  // Property details\n  price     Decimal @db.Decimal(10, 2)\n  bedrooms  Int?\n  bathrooms Int?\n  sqft      Int?\n\n  amenities String[]\n  images    String[]\n\n  // Availability\n  available     Boolean   @default(true)\n  availableFrom DateTime?\n\n  // Statistics\n  rating      Float   @default(0)\n  reviewCount Int     @default(0)\n  featured    Boolean @default(false)\n\n  status PropertyStatus @default(AVAILABLE)\n\n  // Relations\n  landlordId String\n  landlord   User   @relation(fields: [landlordId], references: [id], onDelete: Cascade)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  rentals RentalRequest[]\n  reviews Review[]\n  savedBy SavedProperty[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel RentalRequest {\n  id String @id @default(uuid())\n\n  tenantId String\n  tenant   User   @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  propertyId String\n  property   Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n  message    String?\n  status     RequestStatus @default(PENDING)\n\n  startDate DateTime?\n  endDate   DateTime?\n\n  payment Payment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  rating  Int     @default(5)\n  comment String?\n\n  tenantId String\n  tenant   User   @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  propertyId String\n  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel SavedProperty {\n  id String @id @default(uuid())\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  propertyId String\n  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@unique([userId, propertyId])\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String\n  email    String  @unique\n  password String\n  role     Role    @default(TENANT)\n  isBanned Boolean @default(false)\n\n  properties      Property[]\n  rentals         RentalRequest[]\n  reviews         Review[]\n  payments        Payment[]\n  savedProperties SavedProperty[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"properties","kind":"object","type":"Property","relationName":"CategoryToProperty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"NewsletterSubscriber":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"rentalRequestId","kind":"scalar","type":"String"},{"name":"rentalRequest","kind":"object","type":"RentalRequest","relationName":"PaymentToRentalRequest"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Property":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"neighborhood","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Float"},{"name":"longitude","kind":"scalar","type":"Float"},{"name":"location","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"bedrooms","kind":"scalar","type":"Int"},{"name":"bathrooms","kind":"scalar","type":"Int"},{"name":"sqft","kind":"scalar","type":"Int"},{"name":"amenities","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"available","kind":"scalar","type":"Boolean"},{"name":"availableFrom","kind":"scalar","type":"DateTime"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"reviewCount","kind":"scalar","type":"Int"},{"name":"featured","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"PropertyStatus"},{"name":"landlordId","kind":"scalar","type":"String"},{"name":"landlord","kind":"object","type":"User","relationName":"PropertyToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProperty"},{"name":"rentals","kind":"object","type":"RentalRequest","relationName":"PropertyToRentalRequest"},{"name":"reviews","kind":"object","type":"Review","relationName":"PropertyToReview"},{"name":"savedBy","kind":"object","type":"SavedProperty","relationName":"PropertyToSavedProperty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"RentalRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"tenant","kind":"object","type":"User","relationName":"RentalRequestToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToRentalRequest"},{"name":"message","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"RequestStatus"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToRentalRequest"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"tenant","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"SavedProperty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SavedPropertyToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToSavedProperty"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToUser"},{"name":"rentals","kind":"object","type":"RentalRequest","relationName":"RentalRequestToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"savedProperties","kind":"object","type":"SavedProperty","relationName":"SavedPropertyToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","properties","tenant","property","rentalRequest","user","payment","_count","rentals","reviews","payments","savedProperties","landlord","category","savedBy","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","data","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","create","update","Category.upsertOne","Category.deleteOne","Category.deleteMany","having","_min","_max","Category.groupBy","Category.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.createManyAndReturn","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.updateManyAndReturn","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","NewsletterSubscriber.findUnique","NewsletterSubscriber.findUniqueOrThrow","NewsletterSubscriber.findFirst","NewsletterSubscriber.findFirstOrThrow","NewsletterSubscriber.findMany","NewsletterSubscriber.createOne","NewsletterSubscriber.createMany","NewsletterSubscriber.createManyAndReturn","NewsletterSubscriber.updateOne","NewsletterSubscriber.updateMany","NewsletterSubscriber.updateManyAndReturn","NewsletterSubscriber.upsertOne","NewsletterSubscriber.deleteOne","NewsletterSubscriber.deleteMany","NewsletterSubscriber.groupBy","NewsletterSubscriber.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","Property.findUnique","Property.findUniqueOrThrow","Property.findFirst","Property.findFirstOrThrow","Property.findMany","Property.createOne","Property.createMany","Property.createManyAndReturn","Property.updateOne","Property.updateMany","Property.updateManyAndReturn","Property.upsertOne","Property.deleteOne","Property.deleteMany","Property.groupBy","Property.aggregate","RentalRequest.findUnique","RentalRequest.findUniqueOrThrow","RentalRequest.findFirst","RentalRequest.findFirstOrThrow","RentalRequest.findMany","RentalRequest.createOne","RentalRequest.createMany","RentalRequest.createManyAndReturn","RentalRequest.updateOne","RentalRequest.updateMany","RentalRequest.updateManyAndReturn","RentalRequest.upsertOne","RentalRequest.deleteOne","RentalRequest.deleteMany","RentalRequest.groupBy","RentalRequest.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","SavedProperty.findUnique","SavedProperty.findUniqueOrThrow","SavedProperty.findFirst","SavedProperty.findFirstOrThrow","SavedProperty.findMany","SavedProperty.createOne","SavedProperty.createMany","SavedProperty.createManyAndReturn","SavedProperty.updateOne","SavedProperty.updateMany","SavedProperty.updateManyAndReturn","SavedProperty.upsertOne","SavedProperty.deleteOne","SavedProperty.deleteMany","SavedProperty.groupBy","SavedProperty.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","Role","role","isBanned","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","userId","propertyId","rating","comment","tenantId","message","RequestStatus","status","startDate","endDate","title","description","address","neighborhood","city","state","zipCode","country","latitude","longitude","location","price","bedrooms","bathrooms","sqft","amenities","images","available","availableFrom","reviewCount","featured","PropertyStatus","landlordId","categoryId","has","hasEvery","hasSome","transactionId","amount","PaymentProvider","provider","PaymentStatus","rentalRequestId","paidAt","subject","userId_propertyId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "2QRTkAEIAwAAiQIAIKkBAAC5AgAwqgEAACcAEKsBAAC5AgAwrAEBAAAAAa0BAQAAAAGzAUAAiAIAIbQBQACIAgAhAQAAAAEAICQKAACKAgAgCwAAiwIAIA4AALwCACAPAADOAgAgEAAAjQIAIKkBAADJAgAwqgEAAAMAEKsBAADJAgAwrAEBAIUCACGzAUAAiAIAIbQBQACIAgAhxQEIAMwCACHKAQAAzQLjASLNAQEAhQIAIc4BAQCFAgAhzwEBAIUCACHQAQEAwAIAIdEBAQCFAgAh0gEBAIUCACHTAQEAwAIAIdQBAQCFAgAh1QEIAMoCACHWAQgAygIAIdcBAQDAAgAh2AEQAMICACHZAQIAywIAIdoBAgDLAgAh2wECAMsCACHcAQAAogIAIN0BAACiAgAg3gEgAIcCACHfAUAAxQIAIeABAgC_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_QMAICQAAPwDACBVAAD7AwAgVgAA_gMAINABAADxAwAg0wEAAPEDACDVAQAA8QMAINYBAADxAwAg1wEAAPEDACDZAQAA8QMAINoBAADxAwAg2wEAAPEDACDfAQAA8QMAIB-pAQAAngIAMKoBAACYAQAQqwEAAJ4CADCsAQEA9wEAIbMBQAD6AQAhtAFAAPoBACHFAQgAowIAIcoBAACkAuMBIs0BAQD3AQAhzgEBAPcBACHPAQEA9wEAIdABAQCRAgAh0QEBAPcBACHSAQEA9wEAIdMBAQCRAgAh1AEBAPcBACHVAQgAnwIAIdYBCACfAgAh1wEBAJECACHYARAAoAIAIdkBAgChAgAh2gECAKECACHbAQIAoQIAIdwBAACiAgAg3QEAAKICACDeASAA-QEAId8BQACZAgAh4AECAJACACHhASAA-QEAIeMBAQD3AQAh5AEBAPcBACEDAAAAAwAgAQAAlwEAMCIAAJgBACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAoAIAEAAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACAMBAAA3AMAIAUAAKUDACAIAACmAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxAEBAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABzAFAAAAAAQEWAACgAQAgCawBAQAAAAGzAUAAAAABtAFAAAAAAcQBAQAAAAHHAQEAAAAByAEBAAAAAcoBAAAAygECywFAAAAAAcwBQAAAAAEBFgAAogEAMAEWAACiAQAwDAQAANoDACAFAACXAwAgCAAAmAMAIKwBAQDSAgAhswFAANUCACG0AUAA1QIAIcQBAQDSAgAhxwEBANICACHIAQEAhgMAIcoBAACVA8oBIssBQAD2AgAhzAFAAPYCACECAAAACgAgFgAApQEAIAmsAQEA0gIAIbMBQADVAgAhtAFAANUCACHEAQEA0gIAIccBAQDSAgAhyAEBAIYDACHKAQAAlQPKASLLAUAA9gIAIcwBQAD2AgAhAgAAAAgAIBYAAKcBACACAAAACAAgFgAApwEAIAMAAAAKACAdAACgAQAgHgAApQEAIAEAAAAKACABAAAACAAgBgkAAPcDACAjAAD5AwAgJAAA-AMAIMgBAADxAwAgywEAAPEDACDMAQAA8QMAIAypAQAAlwIAMKoBAACuAQAQqwEAAJcCADCsAQEA9wEAIbMBQAD6AQAhtAFAAPoBACHEAQEA9wEAIccBAQD3AQAhyAEBAJECACHKAQAAmALKASLLAUAAmQIAIcwBQACZAgAhAwAAAAgAIAEAAK0BADAiAACuAQAgAwAAAAgAIAEAAAkAMAIAAAoAIAEAAAATACABAAAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgCQQAANEDACAFAACKAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxAEBAAAAAcUBAgAAAAHGAQEAAAABxwEBAAAAAQEWAAC2AQAgB6wBAQAAAAGzAUAAAAABtAFAAAAAAcQBAQAAAAHFAQIAAAABxgEBAAAAAccBAQAAAAEBFgAAuAEAMAEWAAC4AQAwCQQAAM8DACAFAACIAwAgrAEBANICACGzAUAA1QIAIbQBQADVAgAhxAEBANICACHFAQIAhQMAIcYBAQCGAwAhxwEBANICACECAAAAEwAgFgAAuwEAIAesAQEA0gIAIbMBQADVAgAhtAFAANUCACHEAQEA0gIAIcUBAgCFAwAhxgEBAIYDACHHAQEA0gIAIQIAAAARACAWAAC9AQAgAgAAABEAIBYAAL0BACADAAAAEwAgHQAAtgEAIB4AALsBACABAAAAEwAgAQAAABEAIAYJAADyAwAgIwAA9QMAICQAAPQDACBVAADzAwAgVgAA9gMAIMYBAADxAwAgCqkBAACPAgAwqgEAAMQBABCrAQAAjwIAMKwBAQD3AQAhswFAAPoBACG0AUAA-gEAIcQBAQD3AQAhxQECAJACACHGAQEAkQIAIccBAQD3AQAhAwAAABEAIAEAAMMBADAiAADEAQAgAwAAABEAIAEAABIAMAIAABMAIAEAAAAYACABAAAAGAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAAWACABAAAXADACAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgBgUAAOgCACAHAADGAwAgrAEBAAAAAbMBQAAAAAHDAQEAAAABxAEBAAAAAQEWAADMAQAgBKwBAQAAAAGzAUAAAAABwwEBAAAAAcQBAQAAAAEBFgAAzgEAMAEWAADOAQAwBgUAAOYCACAHAADEAwAgrAEBANICACGzAUAA1QIAIcMBAQDSAgAhxAEBANICACECAAAAGAAgFgAA0QEAIASsAQEA0gIAIbMBQADVAgAhwwEBANICACHEAQEA0gIAIQIAAAAWACAWAADTAQAgAgAAABYAIBYAANMBACADAAAAGAAgHQAAzAEAIB4AANEBACABAAAAGAAgAQAAABYAIAMJAADuAwAgIwAA8AMAICQAAO8DACAHqQEAAI4CADCqAQAA2gEAEKsBAACOAgAwrAEBAPcBACGzAUAA-gEAIcMBAQD3AQAhxAEBAPcBACEDAAAAFgAgAQAA2QEAMCIAANoBACADAAAAFgAgAQAAFwAwAgAAGAAgEAMAAIkCACAKAACKAgAgCwAAiwIAIAwAAIwCACANAACNAgAgqQEAAIQCADCqAQAA4AEAEKsBAACEAgAwrAEBAAAAAa0BAQCFAgAhrgEBAAAAAa8BAQCFAgAhsQEAAIYCsQEisgEgAIcCACGzAUAAiAIAIbQBQACIAgAhAQAAAN0BACABAAAA3QEAIBADAACJAgAgCgAAigIAIAsAAIsCACAMAACMAgAgDQAAjQIAIKkBAACEAgAwqgEAAOABABCrAQAAhAIAMKwBAQCFAgAhrQEBAIUCACGuAQEAhQIAIa8BAQCFAgAhsQEAAIYCsQEisgEgAIcCACGzAUAAiAIAIbQBQACIAgAhBQMAAOkDACAKAADqAwAgCwAA6wMAIAwAAOwDACANAADtAwAgAwAAAOABACABAADhAQAwAgAA3QEAIAMAAADgAQAgAQAA4QEAMAIAAN0BACADAAAA4AEAIAEAAOEBADACAADdAQAgDQMAAOQDACAKAADlAwAgCwAA5gMAIAwAAOcDACANAADoAwAgrAEBAAAAAa0BAQAAAAGuAQEAAAABrwEBAAAAAbEBAAAAsQECsgEgAAAAAbMBQAAAAAG0AUAAAAABARYAAOUBACAIrAEBAAAAAa0BAQAAAAGuAQEAAAABrwEBAAAAAbEBAAAAsQECsgEgAAAAAbMBQAAAAAG0AUAAAAABARYAAOcBADABFgAA5wEAMA0DAADWAgAgCgAA1wIAIAsAANgCACAMAADZAgAgDQAA2gIAIKwBAQDSAgAhrQEBANICACGuAQEA0gIAIa8BAQDSAgAhsQEAANMCsQEisgEgANQCACGzAUAA1QIAIbQBQADVAgAhAgAAAN0BACAWAADqAQAgCKwBAQDSAgAhrQEBANICACGuAQEA0gIAIa8BAQDSAgAhsQEAANMCsQEisgEgANQCACGzAUAA1QIAIbQBQADVAgAhAgAAAOABACAWAADsAQAgAgAAAOABACAWAADsAQAgAwAAAN0BACAdAADlAQAgHgAA6gEAIAEAAADdAQAgAQAAAOABACADCQAAzwIAICMAANECACAkAADQAgAgC6kBAAD2AQAwqgEAAPMBABCrAQAA9gEAMKwBAQD3AQAhrQEBAPcBACGuAQEA9wEAIa8BAQD3AQAhsQEAAPgBsQEisgEgAPkBACGzAUAA-gEAIbQBQAD6AQAhAwAAAOABACABAADyAQAwIgAA8wEAIAMAAADgAQAgAQAA4QEAMAIAAN0BACALqQEAAPYBADCqAQAA8wEAEKsBAAD2AQAwrAEBAPcBACGtAQEA9wEAIa4BAQD3AQAhrwEBAPcBACGxAQAA-AGxASKyASAA-QEAIbMBQAD6AQAhtAFAAPoBACEOCQAA_AEAICMAAIMCACAkAACDAgAgtQEBAAAAAbYBAQAAAAS3AQEAAAAEuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCCAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABBwkAAPwBACAjAACBAgAgJAAAgQIAILUBAAAAsQECtgEAAACxAQi3AQAAALEBCLwBAACAArEBIgUJAAD8AQAgIwAA_wEAICQAAP8BACC1ASAAAAABvAEgAP4BACELCQAA_AEAICMAAP0BACAkAAD9AQAgtQFAAAAAAbYBQAAAAAS3AUAAAAAEuAFAAAAAAbkBQAAAAAG6AUAAAAABuwFAAAAAAbwBQAD7AQAhCwkAAPwBACAjAAD9AQAgJAAA_QEAILUBQAAAAAG2AUAAAAAEtwFAAAAABLgBQAAAAAG5AUAAAAABugFAAAAAAbsBQAAAAAG8AUAA-wEAIQi1AQIAAAABtgECAAAABLcBAgAAAAS4AQIAAAABuQECAAAAAboBAgAAAAG7AQIAAAABvAECAPwBACEItQFAAAAAAbYBQAAAAAS3AUAAAAAEuAFAAAAAAbkBQAAAAAG6AUAAAAABuwFAAAAAAbwBQAD9AQAhBQkAAPwBACAjAAD_AQAgJAAA_wEAILUBIAAAAAG8ASAA_gEAIQK1ASAAAAABvAEgAP8BACEHCQAA_AEAICMAAIECACAkAACBAgAgtQEAAACxAQK2AQAAALEBCLcBAAAAsQEIvAEAAIACsQEiBLUBAAAAsQECtgEAAACxAQi3AQAAALEBCLwBAACBArEBIg4JAAD8AQAgIwAAgwIAICQAAIMCACC1AQEAAAABtgEBAAAABLcBAQAAAAS4AQEAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAIICACG9AQEAAAABvgEBAAAAAb8BAQAAAAELtQEBAAAAAbYBAQAAAAS3AQEAAAAEuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCDAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABEAMAAIkCACAKAACKAgAgCwAAiwIAIAwAAIwCACANAACNAgAgqQEAAIQCADCqAQAA4AEAEKsBAACEAgAwrAEBAIUCACGtAQEAhQIAIa4BAQCFAgAhrwEBAIUCACGxAQAAhgKxASKyASAAhwIAIbMBQACIAgAhtAFAAIgCACELtQEBAAAAAbYBAQAAAAS3AQEAAAAEuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCDAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABBLUBAAAAsQECtgEAAACxAQi3AQAAALEBCLwBAACBArEBIgK1ASAAAAABvAEgAP8BACEItQFAAAAAAbYBQAAAAAS3AUAAAAAEuAFAAAAAAbkBQAAAAAG6AUAAAAABuwFAAAAAAbwBQAD9AQAhA8ABAAADACDBAQAAAwAgwgEAAAMAIAPAAQAACAAgwQEAAAgAIMIBAAAIACADwAEAABEAIMEBAAARACDCAQAAEQAgA8ABAAAMACDBAQAADAAgwgEAAAwAIAPAAQAAFgAgwQEAABYAIMIBAAAWACAHqQEAAI4CADCqAQAA2gEAEKsBAACOAgAwrAEBAPcBACGzAUAA-gEAIcMBAQD3AQAhxAEBAPcBACEKqQEAAI8CADCqAQAAxAEAEKsBAACPAgAwrAEBAPcBACGzAUAA-gEAIbQBQAD6AQAhxAEBAPcBACHFAQIAkAIAIcYBAQCRAgAhxwEBAPcBACENCQAA_AEAICMAAPwBACAkAAD8AQAgVQAAlgIAIFYAAPwBACC1AQIAAAABtgECAAAABLcBAgAAAAS4AQIAAAABuQECAAAAAboBAgAAAAG7AQIAAAABvAECAJUCACEOCQAAkwIAICMAAJQCACAkAACUAgAgtQEBAAAAAbYBAQAAAAW3AQEAAAAFuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCSAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABDgkAAJMCACAjAACUAgAgJAAAlAIAILUBAQAAAAG2AQEAAAAFtwEBAAAABbgBAQAAAAG5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAkgIAIb0BAQAAAAG-AQEAAAABvwEBAAAAAQi1AQIAAAABtgECAAAABbcBAgAAAAW4AQIAAAABuQECAAAAAboBAgAAAAG7AQIAAAABvAECAJMCACELtQEBAAAAAbYBAQAAAAW3AQEAAAAFuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCUAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABDQkAAPwBACAjAAD8AQAgJAAA_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_AEAICMAALECACAkAACxAgAgtQEAAADtAQK2AQAAAO0BCLcBAAAA7QEIvAEAALAC7QEiBwkAAPwBACAjAACxAgAgJAAAsQIAILUBAAAA7QECtgEAAADtAQi3AQAAAO0BCLwBAACwAu0BIgS1AQAAAO0BArYBAAAA7QEItwEAAADtAQi8AQAAsQLtASIHCQAA_AEAICMAALMCACAkAACzAgAgtQEAAADrAQK2AQAAAOsBCLcBAAAA6wEIvAEAALIC6wEiBLUBAAAA6wECtgEAAADrAQi3AQAAAOsBCLwBAACzAusBIgapAQAAtAIAMKoBAABsABCrAQAAtAIAMKwBAQD3AQAhrgEBAPcBACGzAUAA-gEAIQapAQAAtQIAMKoBAABZABCrAQAAtQIAMKwBAQCFAgAhrgEBAIUCACGzAUAAiAIAIQmpAQAAtgIAMKoBAABTABCrAQAAtgIAMKwBAQD3AQAhrQEBAPcBACGuAQEA9wEAIbMBQAD6AQAhyAEBAPcBACHvAQEA9wEAIQmpAQAAtwIAMKoBAABAABCrAQAAtwIAMKwBAQCFAgAhrQEBAIUCACGuAQEAhQIAIbMBQACIAgAhyAEBAIUCACHvAQEAhQIAIQepAQAAuAIAMKoBAAA6ABCrAQAAuAIAMKwBAQD3AQAhrQEBAPcBACGzAUAA-gEAIbQBQAD6AQAhCAMAAIkCACCpAQAAuQIAMKoBAAAnABCrAQAAuQIAMKwBAQCFAgAhrQEBAIUCACGzAUAAiAIAIbQBQACIAgAhAsMBAQAAAAHEAQEAAAABCQUAAL0CACAHAAC8AgAgqQEAALsCADCqAQAAFgAQqwEAALsCADCsAQEAhQIAIbMBQACIAgAhwwEBAIUCACHEAQEAhQIAIRIDAACJAgAgCgAAigIAIAsAAIsCACAMAACMAgAgDQAAjQIAIKkBAACEAgAwqgEAAOABABCrAQAAhAIAMKwBAQCFAgAhrQEBAIUCACGuAQEAhQIAIa8BAQCFAgAhsQEAAIYCsQEisgEgAIcCACGzAUAAiAIAIbQBQACIAgAh8QEAAOABACDyAQAA4AEAICYKAACKAgAgCwAAiwIAIA4AALwCACAPAADOAgAgEAAAjQIAIKkBAADJAgAwqgEAAAMAEKsBAADJAgAwrAEBAIUCACGzAUAAiAIAIbQBQACIAgAhxQEIAMwCACHKAQAAzQLjASLNAQEAhQIAIc4BAQCFAgAhzwEBAIUCACHQAQEAwAIAIdEBAQCFAgAh0gEBAIUCACHTAQEAwAIAIdQBAQCFAgAh1QEIAMoCACHWAQgAygIAIdcBAQDAAgAh2AEQAMICACHZAQIAywIAIdoBAgDLAgAh2wECAMsCACHcAQAAogIAIN0BAACiAgAg3gEgAIcCACHfAUAAxQIAIeABAgC_AgAh4QEgAIcCACHjAQEAhQIAIeQBAQCFAgAh8QEAAAMAIPIBAAADACAMBAAAvAIAIAUAAL0CACCpAQAAvgIAMKoBAAARABCrAQAAvgIAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcQBAQCFAgAhxQECAL8CACHGAQEAwAIAIccBAQCFAgAhCLUBAgAAAAG2AQIAAAAEtwECAAAABLgBAgAAAAG5AQIAAAABugECAAAAAbsBAgAAAAG8AQIA_AEAIQu1AQEAAAABtgEBAAAABbcBAQAAAAW4AQEAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAJQCACG9AQEAAAABvgEBAAAAAb8BAQAAAAEPBgAAxgIAIAcAALwCACCpAQAAwQIAMKoBAAAMABCrAQAAwQIAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcMBAQCFAgAhygEAAMQC7QEi6AEBAIUCACHpARAAwgIAIesBAADDAusBIu0BAQCFAgAh7gFAAMUCACEItQEQAAAAAbYBEAAAAAS3ARAAAAAEuAEQAAAAAbkBEAAAAAG6ARAAAAABuwEQAAAAAbwBEACrAgAhBLUBAAAA6wECtgEAAADrAQi3AQAAAOsBCLwBAACzAusBIgS1AQAAAO0BArYBAAAA7QEItwEAAADtAQi8AQAAsQLtASIItQFAAAAAAbYBQAAAAAW3AUAAAAAFuAFAAAAAAbkBQAAAAAG6AUAAAAABuwFAAAAAAbwBQACbAgAhEQQAALwCACAFAAC9AgAgCAAAjAIAIKkBAADHAgAwqgEAAAgAEKsBAADHAgAwrAEBAIUCACGzAUAAiAIAIbQBQACIAgAhxAEBAIUCACHHAQEAhQIAIcgBAQDAAgAhygEAAMgCygEiywFAAMUCACHMAUAAxQIAIfEBAAAIACDyAQAACAAgDwQAALwCACAFAAC9AgAgCAAAjAIAIKkBAADHAgAwqgEAAAgAEKsBAADHAgAwrAEBAIUCACGzAUAAiAIAIbQBQACIAgAhxAEBAIUCACHHAQEAhQIAIcgBAQDAAgAhygEAAMgCygEiywFAAMUCACHMAUAAxQIAIQS1AQAAAMoBArYBAAAAygEItwEAAADKAQi8AQAAnQLKASIkCgAAigIAIAsAAIsCACAOAAC8AgAgDwAAzgIAIBAAAI0CACCpAQAAyQIAMKoBAAADABCrAQAAyQIAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcUBCADMAgAhygEAAM0C4wEizQEBAIUCACHOAQEAhQIAIc8BAQCFAgAh0AEBAMACACHRAQEAhQIAIdIBAQCFAgAh0wEBAMACACHUAQEAhQIAIdUBCADKAgAh1gEIAMoCACHXAQEAwAIAIdgBEADCAgAh2QECAMsCACHaAQIAywIAIdsBAgDLAgAh3AEAAKICACDdAQAAogIAIN4BIACHAgAh3wFAAMUCACHgAQIAvwIAIeEBIACHAgAh4wEBAIUCACHkAQEAhQIAIQi1AQgAAAABtgEIAAAABbcBCAAAAAW4AQgAAAABuQEIAAAAAboBCAAAAAG7AQgAAAABvAEIAKkCACEItQECAAAAAbYBAgAAAAW3AQIAAAAFuAECAAAAAbkBAgAAAAG6AQIAAAABuwECAAAAAbwBAgCTAgAhCLUBCAAAAAG2AQgAAAAEtwEIAAAABLgBCAAAAAG5AQgAAAABugEIAAAAAbsBCAAAAAG8AQgAlgIAIQS1AQAAAOMBArYBAAAA4wEItwEAAADjAQi8AQAApgLjASIKAwAAiQIAIKkBAAC5AgAwqgEAACcAEKsBAAC5AgAwrAEBAIUCACGtAQEAhQIAIbMBQACIAgAhtAFAAIgCACHxAQAAJwAg8gEAACcAIAAAAAH2AQEAAAABAfYBAAAAsQECAfYBIAAAAAEB9gFAAAAAAQsdAACnAwAwHgAArAMAMPMBAACoAwAw9AEAAKkDADD1AQAAqgMAIPYBAACrAwAw9wEAAKsDADD4AQAAqwMAMPkBAACrAwAw-gEAAK0DADD7AQAArgMAMAsdAACLAwAwHgAAkAMAMPMBAACMAwAw9AEAAI0DADD1AQAAjgMAIPYBAACPAwAw9wEAAI8DADD4AQAAjwMAMPkBAACPAwAw-gEAAJEDADD7AQAAkgMAMAsdAAD7AgAwHgAAgAMAMPMBAAD8AgAw9AEAAP0CADD1AQAA_gIAIPYBAAD_AgAw9wEAAP8CADD4AQAA_wIAMPkBAAD_AgAw-gEAAIEDADD7AQAAggMAMAsdAADpAgAwHgAA7gIAMPMBAADqAgAw9AEAAOsCADD1AQAA7AIAIPYBAADtAgAw9wEAAO0CADD4AQAA7QIAMPkBAADtAgAw-gEAAO8CADD7AQAA8AIAMAsdAADbAgAwHgAA4AIAMPMBAADcAgAw9AEAAN0CADD1AQAA3gIAIPYBAADfAgAw9wEAAN8CADD4AQAA3wIAMPkBAADfAgAw-gEAAOECADD7AQAA4gIAMAQFAADoAgAgrAEBAAAAAbMBQAAAAAHEAQEAAAABAgAAABgAIB0AAOcCACADAAAAGAAgHQAA5wIAIB4AAOUCACABFgAA2QQAMAoFAAC9AgAgBwAAvAIAIKkBAAC7AgAwqgEAABYAEKsBAAC7AgAwrAEBAAAAAbMBQACIAgAhwwEBAIUCACHEAQEAhQIAIfABAAC6AgAgAgAAABgAIBYAAOUCACACAAAA4wIAIBYAAOQCACAHqQEAAOICADCqAQAA4wIAEKsBAADiAgAwrAEBAIUCACGzAUAAiAIAIcMBAQCFAgAhxAEBAIUCACEHqQEAAOICADCqAQAA4wIAEKsBAADiAgAwrAEBAIUCACGzAUAAiAIAIcMBAQCFAgAhxAEBAIUCACEDrAEBANICACGzAUAA1QIAIcQBAQDSAgAhBAUAAOYCACCsAQEA0gIAIbMBQADVAgAhxAEBANICACEFHQAA1AQAIB4AANcEACDzAQAA1QQAIPQBAADWBAAg-QEAAAUAIAQFAADoAgAgrAEBAAAAAbMBQAAAAAHEAQEAAAABAx0AANQEACDzAQAA1QQAIPkBAAAFACAKBgAA-gIAIKwBAQAAAAGzAUAAAAABtAFAAAAAAcoBAAAA7QEC6AEBAAAAAekBEAAAAAHrAQAAAOsBAu0BAQAAAAHuAUAAAAABAgAAAA4AIB0AAPkCACADAAAADgAgHQAA-QIAIB4AAPcCACABFgAA0wQAMA8GAADGAgAgBwAAvAIAIKkBAADBAgAwqgEAAAwAEKsBAADBAgAwrAEBAAAAAbMBQACIAgAhtAFAAIgCACHDAQEAhQIAIcoBAADEAu0BIugBAQAAAAHpARAAwgIAIesBAADDAusBIu0BAQCFAgAh7gFAAMUCACECAAAADgAgFgAA9wIAIAIAAADxAgAgFgAA8gIAIA2pAQAA8AIAMKoBAADxAgAQqwEAAPACADCsAQEAhQIAIbMBQACIAgAhtAFAAIgCACHDAQEAhQIAIcoBAADEAu0BIugBAQCFAgAh6QEQAMICACHrAQAAwwLrASLtAQEAhQIAIe4BQADFAgAhDakBAADwAgAwqgEAAPECABCrAQAA8AIAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcMBAQCFAgAhygEAAMQC7QEi6AEBAIUCACHpARAAwgIAIesBAADDAusBIu0BAQCFAgAh7gFAAMUCACEJrAEBANICACGzAUAA1QIAIbQBQADVAgAhygEAAPUC7QEi6AEBANICACHpARAA8wIAIesBAAD0AusBIu0BAQDSAgAh7gFAAPYCACEF9gEQAAAAAfwBEAAAAAH9ARAAAAAB_gEQAAAAAf8BEAAAAAEB9gEAAADrAQIB9gEAAADtAQIB9gFAAAAAAQoGAAD4AgAgrAEBANICACGzAUAA1QIAIbQBQADVAgAhygEAAPUC7QEi6AEBANICACHpARAA8wIAIesBAAD0AusBIu0BAQDSAgAh7gFAAPYCACEFHQAAzgQAIB4AANEEACDzAQAAzwQAIPQBAADQBAAg-QEAAAoAIAoGAAD6AgAgrAEBAAAAAbMBQAAAAAG0AUAAAAABygEAAADtAQLoAQEAAAAB6QEQAAAAAesBAAAA6wEC7QEBAAAAAe4BQAAAAAEDHQAAzgQAIPMBAADPBAAg-QEAAAoAIAcFAACKAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxAEBAAAAAcUBAgAAAAHGAQEAAAABAgAAABMAIB0AAIkDACADAAAAEwAgHQAAiQMAIB4AAIcDACABFgAAzQQAMAwEAAC8AgAgBQAAvQIAIKkBAAC-AgAwqgEAABEAEKsBAAC-AgAwrAEBAAAAAbMBQACIAgAhtAFAAIgCACHEAQEAhQIAIcUBAgC_AgAhxgEBAMACACHHAQEAhQIAIQIAAAATACAWAACHAwAgAgAAAIMDACAWAACEAwAgCqkBAACCAwAwqgEAAIMDABCrAQAAggMAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcQBAQCFAgAhxQECAL8CACHGAQEAwAIAIccBAQCFAgAhCqkBAACCAwAwqgEAAIMDABCrAQAAggMAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcQBAQCFAgAhxQECAL8CACHGAQEAwAIAIccBAQCFAgAhBqwBAQDSAgAhswFAANUCACG0AUAA1QIAIcQBAQDSAgAhxQECAIUDACHGAQEAhgMAIQX2AQIAAAAB_AECAAAAAf0BAgAAAAH-AQIAAAAB_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_AgAh4QEgAIcCACHjAQEAhQIAIeQBAQCFAgAhAgAAAAUAIBYAALcDACACAAAArwMAIBYAALADACAfqQEAAK4DADCqAQAArwMAEKsBAACuAwAwrAEBAIUCACGzAUAAiAIAIbQBQACIAgAhxQEIAMwCACHKAQAAzQLjASLNAQEAhQIAIc4BAQCFAgAhzwEBAIUCACHQAQEAwAIAIdEBAQCFAgAh0gEBAIUCACHTAQEAwAIAIdQBAQCFAgAh1QEIAMoCACHWAQgAygIAIdcBAQDAAgAh2AEQAMICACHZAQIAywIAIdoBAgDLAgAh2wECAMsCACHcAQAAogIAIN0BAACiAgAg3gEgAIcCACHfAUAAxQIAIeABAgC_AgAh4QEgAIcCACHjAQEAhQIAIeQBAQCFAgAhH6kBAACuAwAwqgEAAK8DABCrAQAArgMAMKwBAQCFAgAhswFAAIgCACG0AUAAiAIAIcUBCADMAgAhygEAAM0C4wEizQEBAIUCACHOAQEAhQIAIc8BAQCFAgAh0AEBAMACACHRAQEAhQIAIdIBAQCFAgAh0wEBAMACACHUAQEAhQIAIdUBCADKAgAh1gEIAMoCACHXAQEAwAIAIdgBEADCAgAh2QECAMsCACHaAQIAywIAIdsBAgDLAgAh3AEAAKICACDdAQAAogIAIN4BIACHAgAh3wFAAMUCACHgAQIAvwIAIeEBIACHAgAh4wEBAIUCACHkAQEAhQIAIRusAQEA0gIAIbMBQADVAgAhtAFAANUCACHFAQgAtQMAIcoBAAC2A-MBIs0BAQDSAgAhzgEBANICACHPAQEA0gIAIdABAQCGAwAh0QEBANICACHSAQEA0gIAIdMBAQCGAwAh1AEBANICACHVAQgAsQMAIdYBCACxAwAh1wEBAIYDACHYARAA8wIAIdkBAgCyAwAh2gECALIDACHbAQIAsgMAIdwBAACzAwAg3QEAALQDACDeASAA1AIAId8BQAD2AgAh4AECAIUDACHhASAA1AIAIeQBAQDSAgAhBfYBCAAAAAH8AQgAAAAB_QEIAAAAAf4BCAAAAAH_AQgAAAABBfYBAgAAAAH8AQIAAAAB_QECAAAAAf4BAgAAAAH_AQIAAAABAvYBAQAAAASAAgEAAAAFAvYBAQAAAASAAgEAAAAFBfYBCAAAAAH8AQgAAAAB_QEIAAAAAf4BCAAAAAH_AQgAAAABAfYBAAAA4wECHwoAALkDACALAAC6AwAgDwAAuAMAIBAAALsDACCsAQEA0gIAIbMBQADVAgAhtAFAANUCACHFAQgAtQMAIcoBAAC2A-MBIs0BAQDSAgAhzgEBANICACHPAQEA0gIAIdABAQCGAwAh0QEBANICACHSAQEA0gIAIdMBAQCGAwAh1AEBANICACHVAQgAsQMAIdYBCACxAwAh1wEBAIYDACHYARAA8wIAIdkBAgCyAwAh2gECALIDACHbAQIAsgMAIdwBAACzAwAg3QEAALQDACDeASAA1AIAId8BQAD2AgAh4AECAIUDACHhASAA1AIAIeQBAQDSAgAhBR0AAKQEACAeAAC5BAAg8wEAAKUEACD0AQAAuAQAIPkBAAABACALHQAA0gMAMB4AANYDADDzAQAA0wMAMPQBAADUAwAw9QEAANUDACD2AQAAjwMAMPcBAACPAwAw-AEAAI8DADD5AQAAjwMAMPoBAADXAwAw-wEAAJIDADALHQAAxwMAMB4AAMsDADDzAQAAyAMAMPQBAADJAwAw9QEAAMoDACD2AQAA_wIAMPcBAAD_AgAw-AEAAP8CADD5AQAA_wIAMPoBAADMAwAw-wEAAIIDADALHQAAvAMAMB4AAMADADDzAQAAvQMAMPQBAAC-AwAw9QEAAL8DACD2AQAA3wIAMPcBAADfAgAw-AEAAN8CADD5AQAA3wIAMPoBAADBAwAw-wEAAOICADAEBwAAxgMAIKwBAQAAAAGzAUAAAAABwwEBAAAAAQIAAAAYACAdAADFAwAgAwAAABgAIB0AAMUDACAeAADDAwAgARYAALcEADACAAAAGAAgFgAAwwMAIAIAAADjAgAgFgAAwgMAIAOsAQEA0gIAIbMBQADVAgAhwwEBANICACEEBwAAxAMAIKwBAQDSAgAhswFAANUCACHDAQEA0gIAIQUdAACyBAAgHgAAtQQAIPMBAACzBAAg9AEAALQEACD5AQAA3QEAIAQHAADGAwAgrAEBAAAAAbMBQAAAAAHDAQEAAAABAx0AALIEACDzAQAAswQAIPkBAADdAQAgBwQAANEDACCsAQEAAAABswFAAAAAAbQBQAAAAAHFAQIAAAABxgEBAAAAAccBAQAAAAECAAAAEwAgHQAA0AMAIAMAAAATACAdAADQAwAgHgAAzgMAIAEWAACxBAAwAgAAABMAIBYAAM4DACACAAAAgwMAIBYAAM0DACAGrAEBANICACGzAUAA1QIAIbQBQADVAgAhxQECAIUDACHGAQEAhgMAIccBAQDSAgAhBwQAAM8DACCsAQEA0gIAIbMBQADVAgAhtAFAANUCACHFAQIAhQMAIcYBAQCGAwAhxwEBANICACEFHQAArAQAIB4AAK8EACDzAQAArQQAIPQBAACuBAAg-QEAAN0BACAHBAAA0QMAIKwBAQAAAAGzAUAAAAABtAFAAAAAAcUBAgAAAAHGAQEAAAABxwEBAAAAAQMdAACsBAAg8wEAAK0EACD5AQAA3QEAIAoEAADcAwAgCAAApgMAIKwBAQAAAAGzAUAAAAABtAFAAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABzAFAAAAAAQIAAAAKACAdAADbAwAgAwAAAAoAIB0AANsDACAeAADZAwAgARYAAKsEADACAAAACgAgFgAA2QMAIAIAAACTAwAgFgAA2AMAIAisAQEA0gIAIbMBQADVAgAhtAFAANUCACHHAQEA0gIAIcgBAQCGAwAhygEAAJUDygEiywFAAPYCACHMAUAA9gIAIQoEAADaAwAgCAAAmAMAIKwBAQDSAgAhswFAANUCACG0AUAA1QIAIccBAQDSAgAhyAEBAIYDACHKAQAAlQPKASLLAUAA9gIAIcwBQAD2AgAhBR0AAKYEACAeAACpBAAg8wEAAKcEACD0AQAAqAQAIPkBAADdAQAgCgQAANwDACAIAACmAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxwEBAAAAAcgBAQAAAAHKAQAAAMoBAssBQAAAAAHMAUAAAAABAx0AAKYEACDzAQAApwQAIPkBAADdAQAgHwoAAOEDACALAADiAwAgDwAA4AMAIBAAAOMDACCsAQEAAAABswFAAAAAAbQBQAAAAAHFAQgAAAABygEAAADjAQLNAQEAAAABzgEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBCAAAAAHWAQgAAAAB1wEBAAAAAdgBEAAAAAHZAQIAAAAB2gECAAAAAdsBAgAAAAHcAQAA3gMAIN0BAADfAwAg3gEgAAAAAd8BQAAAAAHgAQIAAAAB4QEgAAAAAeQBAQAAAAEB9gEBAAAABAH2AQEAAAAEAx0AAKQEACDzAQAApQQAIPkBAAABACAEHQAA0gMAMPMBAADTAwAw9QEAANUDACD5AQAAjwMAMAQdAADHAwAw8wEAAMgDADD1AQAAygMAIPkBAAD_AgAwBB0AALwDADDzAQAAvQMAMPUBAAC_AwAg-QEAAN8CADAEHQAApwMAMPMBAACoAwAw9QEAAKoDACD5AQAAqwMAMAQdAACLAwAw8wEAAIwDADD1AQAAjgMAIPkBAACPAwAwBB0AAPsCADDzAQAA_AIAMPUBAAD-AgAg-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NYCACALAADYAgAgDAAA2QIAIA0AANoCACAWAACqBAAgrAEBANICACGtAQEA0gIAIa4BAQDSAgAhrwEBANICACGxAQAA0wKxASKyASAA1AIAIbMBQADVAgAhtAFAANUCACEMAwAA1gIAIAsAANgCACAMAADZAgAgDQAA2gIAIKwBAQDSAgAhrQEBANICACGuAQEA0gIAIa8BAQDSAgAhsQEAANMCsQEisgEgANQCACGzAUAA1QIAIbQBQADVAgAhCKwBAQAAAAGzAUAAAAABtAFAAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABzAFAAAAAAQwDAADkAwAgCgAA5QMAIAwAAOcDACANAADoAwAgrAEBAAAAAa0BAQAAAAGuAQEAAAABrwEBAAAAAbEBAAAAsQECsgEgAAAAAbMBQAAAAAG0AUAAAAABAgAAAN0BACAdAACsBAAgAwAAAOABACAdAACsBAAgHgAAsAQAIA4AAADgAQAgAwAA1gIAIAoAANcCACAMAADZAgAgDQAA2gIAIBYAALAEACCsAQEA0gIAIa0BAQDSAgAhrgEBANICACGvAQEA0gIAIbEBAADTArEBIrIBIADUAgAhswFAANUCACG0AUAA1QIAIQwDAADWAgAgCgAA1wIAIAwAANkCACANAADaAgAgrAEBANICACGtAQEA0gIAIa4BAQDSAgAhrwEBANICACGxAQAA0wKxASKyASAA1AIAIbMBQADVAgAhtAFAANUCACEGrAEBAAAAAbMBQAAAAAG0AUAAAAABxQECAAAAAcYBAQAAAAHHAQEAAAABDAMAAOQDACAKAADlAwAgCwAA5gMAIAwAAOcDACCsAQEAAAABrQEBAAAAAa4BAQAAAAGvAQEAAAABsQEAAACxAQKyASAAAAABswFAAAAAAbQBQAAAAAECAAAA3QEAIB0AALIEACADAAAA4AEAIB0AALIEACAeAAC2BAAgDgAAAOABACADAADWAgAgCgAA1wIAIAsAANgCACAMAADZAgAgFgAAtgQAIKwBAQDSAgAhrQEBANICACGuAQEA0gIAIa8BAQDSAgAhsQEAANMCsQEisgEgANQCACGzAUAA1QIAIbQBQADVAgAhDAMAANYCACAKAADXAgAgCwAA2AIAIAwAANkCACCsAQEA0gIAIa0BAQDSAgAhrgEBANICACGvAQEA0gIAIbEBAADTArEBIrIBIADUAgAhswFAANUCACG0AUAA1QIAIQOsAQEAAAABswFAAAAAAcMBAQAAAAEDAAAAJwAgHQAApAQAIB4AALoEACAGAAAAJwAgFgAAugQAIKwBAQDSAgAhrQEBANICACGzAUAA1QIAIbQBQADVAgAhBKwBAQDSAgAhrQEBANICACGzAUAA1QIAIbQBQADVAgAhG6wBAQAAAAGzAUAAAAABtAFAAAAAAcUBCAAAAAHKAQAAAOMBAs0BAQAAAAHOAQEAAAABzwEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAQEAAAAB1QEIAAAAAdYBCAAAAAHXAQEAAAAB2AEQAAAAAdkBAgAAAAHaAQIAAAAB2wECAAAAAdwBAADeAwAg3QEAAN8DACDeASAAAAAB3wFAAAAAAeABAgAAAAHhASAAAAAB5AEBAAAAASALAADiAwAgDgAAgAQAIA8AAOADACAQAADjAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxQEIAAAAAcoBAAAA4wECzQEBAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQgAAAAB1gEIAAAAAdcBAQAAAAHYARAAAAAB2QECAAAAAdoBAgAAAAHbAQIAAAAB3AEAAN4DACDdAQAA3wMAIN4BIAAAAAHfAUAAAAAB4AECAAAAAeEBIAAAAAHjAQEAAAAB5AEBAAAAAQIAAAAFACAdAAC8BAAgDAMAAOQDACAKAADlAwAgCwAA5gMAIA0AAOgDACCsAQEAAAABrQEBAAAAAa4BAQAAAAGvAQEAAAABsQEAAACxAQKyASAAAAABswFAAAAAAbQBQAAAAAECAAAA3QEAIB0AAL4EACADAAAA4AEAIB0AAL4EACAeAADCBAAgDgAAAOABACADAADWAgAgCgAA1wIAIAsAANgCACANAADaAgAgFgAAwgQAIKwBAQDSAgAhrQEBANICACGuAQEA0gIAIa8BAQDSAgAhsQEAANMCsQEisgEgANQCACGzAUAA1QIAIbQBQADVAgAhDAMAANYCACAKAADXAgAgCwAA2AIAIA0AANoCACCsAQEA0gIAIa0BAQDSAgAhrgEBANICACGvAQEA0gIAIbEBAADTArEBIrIBIADUAgAhswFAANUCACG0AUAA1QIAIQmsAQEAAAABswFAAAAAAbQBQAAAAAHDAQEAAAABygEAAADtAQLoAQEAAAAB6QEQAAAAAesBAAAA6wEC7gFAAAAAAQMAAAADACAdAAC8BAAgHgAAxgQAICIAAAADACALAAC6AwAgDgAA_wMAIA8AALgDACAQAAC7AwAgFgAAxgQAIKwBAQDSAgAhswFAANUCACG0AUAA1QIAIcUBCAC1AwAhygEAALYD4wEizQEBANICACHOAQEA0gIAIc8BAQDSAgAh0AEBAIYDACHRAQEA0gIAIdIBAQDSAgAh0wEBAIYDACHUAQEA0gIAIdUBCACxAwAh1gEIALEDACHXAQEAhgMAIdgBEADzAgAh2QECALIDACHaAQIAsgMAIdsBAgCyAwAh3AEAALMDACDdAQAAtAMAIN4BIADUAgAh3wFAAPYCACHgAQIAhQMAIeEBIADUAgAh4wEBANICACHkAQEA0gIAISALAAC6AwAgDgAA_wMAIA8AALgDACAQAAC7AwAgrAEBANICACGzAUAA1QIAIbQBQADVAgAhxQEIALUDACHKAQAAtgPjASLNAQEA0gIAIc4BAQDSAgAhzwEBANICACHQAQEAhgMAIdEBAQDSAgAh0gEBANICACHTAQEAhgMAIdQBAQDSAgAh1QEIALEDACHWAQgAsQMAIdcBAQCGAwAh2AEQAPMCACHZAQIAsgMAIdoBAgCyAwAh2wECALIDACHcAQAAswMAIN0BAAC0AwAg3gEgANQCACHfAUAA9gIAIeABAgCFAwAh4QEgANQCACHjAQEA0gIAIeQBAQDSAgAhCKwBAQAAAAGzAUAAAAABtAFAAAAAAcQBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABzAFAAAAAASAKAADhAwAgDgAAgAQAIA8AAOADACAQAADjAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxQEIAAAAAcoBAAAA4wECzQEBAAAAAc4BAQAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQgAAAAB1gEIAAAAAdcBAQAAAAHYARAAAAAB2QECAAAAAdoBAgAAAAHbAQIAAAAB3AEAAN4DACDdAQAA3wMAIN4BIAAAAAHfAUAAAAAB4AECAAAAAeEBIAAAAAHjAQEAAAAB5AEBAAAAAQIAAAAFACAdAADIBAAgAwAAAAMAIB0AAMgEACAeAADMBAAgIgAAAAMAIAoAALkDACAOAAD_AwAgDwAAuAMAIBAAALsDACAWAADMBAAgrAEBANICACGzAUAA1QIAIbQBQADVAgAhxQEIALUDACHKAQAAtgPjASLNAQEA0gIAIc4BAQDSAgAhzwEBANICACHQAQEAhgMAIdEBAQDSAgAh0gEBANICACHTAQEAhgMAIdQBAQDSAgAh1QEIALEDACHWAQgAsQMAIdcBAQCGAwAh2AEQAPMCACHZAQIAsgMAIdoBAgCyAwAh2wECALIDACHcAQAAswMAIN0BAAC0AwAg3gEgANQCACHfAUAA9gIAIeABAgCFAwAh4QEgANQCACHjAQEA0gIAIeQBAQDSAgAhIAoAALkDACAOAAD_AwAgDwAAuAMAIBAAALsDACCsAQEA0gIAIbMBQADVAgAhtAFAANUCACHFAQgAtQMAIcoBAAC2A-MBIs0BAQDSAgAhzgEBANICACHPAQEA0gIAIdABAQCGAwAh0QEBANICACHSAQEA0gIAIdMBAQCGAwAh1AEBANICACHVAQgAsQMAIdYBCACxAwAh1wEBAIYDACHYARAA8wIAIdkBAgCyAwAh2gECALIDACHbAQIAsgMAIdwBAACzAwAg3QEAALQDACDeASAA1AIAId8BQAD2AgAh4AECAIUDACHhASAA1AIAIeMBAQDSAgAh5AEBANICACEGrAEBAAAAAbMBQAAAAAG0AUAAAAABxAEBAAAAAcUBAgAAAAHGAQEAAAABCwQAANwDACAFAAClAwAgrAEBAAAAAbMBQAAAAAG0AUAAAAABxAEBAAAAAccBAQAAAAHIAQEAAAABygEAAADKAQLLAUAAAAABzAFAAAAAAQIAAAAKACAdAADOBAAgAwAAAAgAIB0AAM4EACAeAADSBAAgDQAAAAgAIAQAANoDACAFAACXAwAgFgAA0gQAIKwBAQDSAgAhswFAANUCACG0AUAA1QIAIcQBAQDSAgAhxwEBANICACHIAQEAhgMAIcoBAACVA8oBIssBQAD2AgAhzAFAAPYCACELBAAA2gMAIAUAAJcDACCsAQEA0gIAIbMBQADVAgAhtAFAANUCACHEAQEA0gIAIccBAQDSAgAhyAEBAIYDACHKAQAAlQPKASLLAUAA9gIAIcwBQAD2AgAhCawBAQAAAAGzAUAAAAABtAFAAAAAAcoBAAAA7QEC6AEBAAAAAekBEAAAAAHrAQAAAOsBAu0BAQAAAAHuAUAAAAABIAoAAOEDACALAADiAwAgDgAAgAQAIA8AAOADACCsAQEAAAABswFAAAAAAbQBQAAAAAHFAQgAAAABygEAAADjAQLNAQEAAAABzgEBAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBCAAAAAHWAQgAAAAB1wEBAAAAAdgBEAAAAAHZAQIAAAAB2gECAAAAAdsBAgAAAAHcAQAA3gMAIN0BAADfAwAg3gEgAAAAAd8BQAAAAAHgAQIAAAAB4QEgAAAAAeMBAQAAAAHkAQEAAAABAgAAAAUAIB0AANQEACADAAAAAwAgHQAA1AQAIB4AANgEACAiAAAAAwAgCgAAuQMAIAsAALoDACAOAAD_AwAgDwAAuAMAIBYAANgEACCsAQEA0gIAIbMBQADVAgAhtAFAANUCACHFAQgAtQMAIcoBAAC2A-MBIs0BAQDSAgAhzgEBANICACHPAQEA0gIAIdABAQCGAwAh0QEBANICACHSAQEA0gIAIdMBAQCGAwAh1AEBANICACHVAQgAsQMAIdYBCACxAwAh1wEBAIYDACHYARAA8wIAIdkBAgCyAwAh2gECALIDACHbAQIAsgMAIdwBAACzAwAg3QEAALQDACDeASAA1AIAId8BQAD2AgAh4AECAIUDACHhASAA1AIAIeMBAQDSAgAh5AEBANICACEgCgAAuQMAIAsAALoDACAOAAD_AwAgDwAAuAMAIKwBAQDSAgAhswFAANUCACG0AUAA1QIAIcUBCAC1AwAhygEAALYD4wEizQEBANICACHOAQEA0gIAIc8BAQDSAgAh0AEBAIYDACHRAQEA0gIAIdIBAQDSAgAh0wEBAIYDACHUAQEA0gIAIdUBCACxAwAh1gEIALEDACHXAQEAhgMAIdgBEADzAgAh2QECALIDACHaAQIAsgMAIdsBAgCyAwAh3AEAALMDACDdAQAAtAMAIN4BIADUAgAh3wFAAPYCACHgAQIAhQMAIeEBIADUAgAh4wEBANICACHkAQEA0gIAIQOsAQEAAAABswFAAAAAAcQBAQAAAAECAwYCCQALBgkACgofBAsgBw4AAw8AARAhCAYDBwIJAAkKCwQLFAcMFQUNGQgEBAADBQACCA8FCQAGAgYABAcAAwEIEAACBAADBQACAgUAAgcAAwUDGgAKGwALHAAMHQANHgADCiIACyMAECQAAQMlAAAAAAMJABAjABEkABIAAAADCQAQIwARJAASAAAAAwkAGCMAGSQAGgAAAAMJABgjABkkABoAAAADCQAgIwAhJAAiAAAAAwkAICMAISQAIgIGAAQHAAMCBgAEBwADBQkAJyMAKiQAK1UAKFYAKQAAAAAABQkAJyMAKiQAK1UAKFYAKQIOAAMPAAECDgADDwABBQkAMCMAMyQANFUAMVYAMgAAAAAABQkAMCMAMyQANFUAMVYAMgIEAAMFAAICBAADBQACAwkAOSMAOiQAOwAAAAMJADkjADokADsCBAADBQACAgQAAwUAAgUJAEAjAEMkAERVAEFWAEIAAAAAAAUJAEAjAEMkAERVAEFWAEICBQACBwADAgUAAgcAAwMJAEkjAEokAEsAAAADCQBJIwBKJABLAAADCQBQIwBRJABSAAAAAwkAUCMAUSQAUhECARImARMpARQqARUrARctARgvDBkwDRoyARs0DBw1Dh82ASA3ASE4DCU7DyY8Eyc-FCg_FClCFCpDFCtEFCxGFC1IDC5JFS9LFDBNDDFOFjJPFDNQFDRRDDVUFzZVGzdXHDhYHDlbHDpcHDtdHDxfHD1hDD5iHT9kHEBmDEFnHkJoHENpHERqDEVtH0ZuI0dvBUhwBUlxBUpyBUtzBUx1BU13DE54JE96BVB8DFF9JVJ-BVN_BVSAAQxXgwEmWIQBLFmFAQJahgECW4cBAlyIAQJdiQECXosBAl-NAQxgjgEtYZABAmKSAQxjkwEuZJQBAmWVAQJmlgEMZ5kBL2iaATVpmwEEapwBBGudAQRsngEEbZ8BBG6hAQRvowEMcKQBNnGmAQRyqAEMc6kBN3SqAQR1qwEEdqwBDHevATh4sAE8ebEBB3qyAQd7swEHfLQBB321AQd-twEHf7kBDIABugE9gQG8AQeCAb4BDIMBvwE-hAHAAQeFAcEBB4YBwgEMhwHFAT-IAcYBRYkBxwEIigHIAQiLAckBCIwBygEIjQHLAQiOAc0BCI8BzwEMkAHQAUaRAdIBCJIB1AEMkwHVAUeUAdYBCJUB1wEIlgHYAQyXAdsBSJgB3AFMmQHeAQOaAd8BA5sB4gEDnAHjAQOdAeQBA54B5gEDnwHoAQygAekBTaEB6wEDogHtAQyjAe4BTqQB7wEDpQHwAQOmAfEBDKcB9AFPqAH1AVM"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  ContactMessageScalarFieldEnum: () => ContactMessageScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NewsletterSubscriberScalarFieldEnum: () => NewsletterSubscriberScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  PropertyScalarFieldEnum: () => PropertyScalarFieldEnum,
  QueryMode: () => QueryMode,
  RentalRequestScalarFieldEnum: () => RentalRequestScalarFieldEnum,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SavedPropertyScalarFieldEnum: () => SavedPropertyScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Category: "Category",
  ContactMessage: "ContactMessage",
  NewsletterSubscriber: "NewsletterSubscriber",
  Payment: "Payment",
  Property: "Property",
  RentalRequest: "RentalRequest",
  Review: "Review",
  SavedProperty: "SavedProperty",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ContactMessageScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  subject: "subject",
  message: "message",
  createdAt: "createdAt"
};
var NewsletterSubscriberScalarFieldEnum = {
  id: "id",
  email: "email",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  transactionId: "transactionId",
  amount: "amount",
  provider: "provider",
  status: "status",
  rentalRequestId: "rentalRequestId",
  userId: "userId",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PropertyScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  address: "address",
  neighborhood: "neighborhood",
  city: "city",
  state: "state",
  zipCode: "zipCode",
  country: "country",
  latitude: "latitude",
  longitude: "longitude",
  location: "location",
  price: "price",
  bedrooms: "bedrooms",
  bathrooms: "bathrooms",
  sqft: "sqft",
  amenities: "amenities",
  images: "images",
  available: "available",
  availableFrom: "availableFrom",
  rating: "rating",
  reviewCount: "reviewCount",
  featured: "featured",
  status: "status",
  landlordId: "landlordId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RentalRequestScalarFieldEnum = {
  id: "id",
  tenantId: "tenantId",
  propertyId: "propertyId",
  message: "message",
  status: "status",
  startDate: "startDate",
  endDate: "endDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  tenantId: "tenantId",
  propertyId: "propertyId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SavedPropertyScalarFieldEnum = {
  id: "id",
  userId: "userId",
  propertyId: "propertyId",
  createdAt: "createdAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  role: "role",
  isBanned: "isBanned",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
  ADMIN: "ADMIN"
};
var RequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
};
var PaymentProvider = {
  STRIPE: "STRIPE",
  SSLCOMMERZ: "SSLCOMMERZ"
};
var PropertyStatus = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};
var AppError_default = AppError;

// src/utils/jwtUtils.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(
    payload,
    secret,
    {
      expiresIn
    }
  );
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = { createToken, verifyToken };

// src/modules/user/user.service.ts
import bcrypt from "bcrypt";
import HttpsStatus from "http-status-codes";
var googleClient = new OAuth2Client(config.google_client_id);
var registerUserDB = async (userData) => {
  const { name, email, password, role } = userData;
  if (role && role !== "TENANT" && role !== "LANDLORD") {
    throw new AppError_default(HttpsStatus.FORBIDDEN, "Invalid account type");
  }
  const isExist = await prisma.user.findUnique({
    where: { email }
  });
  if (isExist) {
    throw new AppError_default(HttpsStatus.CONFLICT, "User already Exist");
  }
  const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return user;
};
var logInUserIntoDB = async (userData) => {
  const { email, password } = userData;
  const isExist = await prisma.user.findUnique({
    where: { email }
  });
  if (!isExist) {
    throw new AppError_default(HttpsStatus.NOT_FOUND, "User not Found");
  }
  if (isExist.isBanned) {
    throw new AppError_default(
      HttpsStatus.FORBIDDEN,
      "Your account has been banned."
    );
  }
  const isMatchPassword = await bcrypt.compare(password, isExist.password);
  if (!isMatchPassword) {
    throw new AppError_default(
      HttpsStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }
  const jwtPayload = {
    id: isExist.id,
    name: isExist.name,
    email: isExist.email,
    role: isExist.role
  };
  const accessToken = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_token_secret,
    config.jwt_access_expires_in
  );
  const refreshToken3 = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );
  const { password: _, ...user } = isExist;
  return { accessToken, refreshToken: refreshToken3, user };
};
var getMeDB = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    omit: { password: true }
  });
  if (!user) {
    throw new AppError_default(HttpsStatus.NOT_FOUND, "User not Found");
  }
  return user;
};
var refreshToken = async (refreshToken3) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken3,
    config.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success) {
    throw new AppError_default(
      HttpsStatus.UNAUTHORIZED,
      verifiedRefreshToken.error
    );
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(HttpsStatus.NOT_FOUND, "User not Found");
  }
  if (user.isBanned) {
    throw new AppError_default(HttpsStatus.FORBIDDEN, "User is blocked!");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_token_secret,
    config.jwt_access_expires_in
  );
  return { accessToken };
};
var updateMeDB = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError_default(HttpsStatus.NOT_FOUND, "User not Found");
  }
  const data = {};
  if (payload.name !== void 0) {
    const name = payload.name.trim();
    if (name.length < 2 || name.length > 60) {
      throw new AppError_default(
        HttpsStatus.BAD_REQUEST,
        "Name must be 2\u201360 characters"
      );
    }
    data.name = name;
  }
  if (payload.newPassword) {
    if (payload.newPassword.length < 6) {
      throw new AppError_default(
        HttpsStatus.BAD_REQUEST,
        "Password must be at least 6 characters"
      );
    }
    if (!payload.currentPassword || !await bcrypt.compare(payload.currentPassword, user.password)) {
      throw new AppError_default(
        HttpsStatus.UNAUTHORIZED,
        "Current password is incorrect"
      );
    }
    data.password = await bcrypt.hash(
      payload.newPassword,
      config.bcrypt_salt_rounds
    );
  }
  return prisma.user.update({
    where: { id: userId },
    data,
    omit: { password: true }
  });
};
var googleLoginDB = async (credential, role) => {
  if (!credential) {
    throw new AppError_default(
      HttpsStatus.BAD_REQUEST,
      "Google credential is required"
    );
  }
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.google_client_id
  });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified) {
    throw new AppError_default(
      HttpsStatus.UNAUTHORIZED,
      "Google email is not verified"
    );
  }
  let user = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name ?? payload.email.split("@")[0],
        email: payload.email,
        password: await bcrypt.hash(
          randomUUID(),
          config.bcrypt_salt_rounds
        ),
        role: role === "LANDLORD" ? "LANDLORD" : "TENANT"
      }
    });
  }
  if (user.isBanned) {
    throw new AppError_default(
      HttpsStatus.FORBIDDEN,
      "Your account has been banned."
    );
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_token_secret,
    config.jwt_access_expires_in
  );
  const refreshToken3 = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );
  return { accessToken, refreshToken: refreshToken3 };
};
var authService = {
  registerUserDB,
  logInUserIntoDB,
  getMeDB,
  refreshToken,
  updateMeDB,
  googleLoginDB
};

// src/utils/sendResponse.ts
var sendResponse = async (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data
  });
};

// src/modules/user/user.controller.ts
import HttpsStatus2 from "http-status-codes";
var registerUser = catchAsync(async (req, res) => {
  const result = await authService.registerUserDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus2.CREATED,
    message: "User Register Successfully",
    data: result
  });
});
var loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken: refreshToken3, user } = await authService.logInUserIntoDB(req.body);
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1e3 * 60 * 60 * 24,
    path: "/"
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1e3 * 60 * 60 * 24 * 7,
    path: "/"
  });
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus2.OK,
    message: "User Login Successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3,
      user
    }
  });
});
var getMe = catchAsync(async (req, res) => {
  const result = await authService.getMeDB(req.user.email);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus2.OK,
    message: "User fetched successfully",
    data: result
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError_default(
      HttpsStatus2.UNAUTHORIZED,
      "Refresh token is required"
    );
  }
  const { accessToken } = await authService.refreshToken(token);
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1e3 * 60 * 60 * 24,
    path: "/"
  });
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus2.OK,
    message: "Token Refreshed Successfully",
    data: { accessToken }
  });
});
var updateMe = catchAsync(async (req, res) => {
  const result = await authService.updateMeDB(req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus2.OK,
    message: "Profile updated",
    data: result
  });
});
var googleLogin = catchAsync(async (req, res) => {
  const { accessToken, refreshToken: refreshToken3 } = await authService.googleLoginDB(
    req.body.credential,
    req.body.role
  );
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1e3 * 60 * 60 * 24,
    path: "/"
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1e3 * 60 * 60 * 24 * 7,
    path: "/"
  });
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus2.OK,
    message: "User Login Successfully",
    data: { accessToken, refreshToken: refreshToken3 }
  });
});
var authController = {
  registerUser,
  loginUser,
  getMe,
  refreshToken: refreshToken2,
  updateMe,
  googleLogin
};

// src/middlewares/auth.ts
var auth = (requiredRole) => catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
  if (!token) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: "Invalid Access Token",
      data: []
    });
  }
  const verifiedToken = jwtUtils.verifyToken(
    token,
    config.jwt_access_token_secret
  );
  if (!verifiedToken.success) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: "Unauthorized Access Token Expired",
      data: []
    });
  }
  if (!verifiedToken.data) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: "User Not Found",
      data: []
    });
  }
  if (!requiredRole.includes(verifiedToken.data.role)) {
    return sendResponse(res, {
      success: false,
      statusCode: 403,
      message: "Forbidden Access",
      data: []
    });
  }
  req.user = {
    id: verifiedToken.data.id,
    name: verifiedToken.data.name,
    email: verifiedToken.data.email,
    role: verifiedToken.data.role
  };
  next();
});
var auth_default = auth;

// src/modules/user/user.route.ts
var router = Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.post("/google", authController.googleLogin);
router.get(
  "/me",
  auth_default([Role.ADMIN, Role.TENANT, Role.LANDLORD]),
  authController.getMe
);
router.patch(
  "/me",
  auth_default([Role.ADMIN, Role.TENANT, Role.LANDLORD]),
  authController.updateMe
);
var authRoute = router;

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError_default) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
};

// src/modules/property/property.route.ts
import { Router as Router2 } from "express";

// src/modules/property/property.service.ts
import HttpsStatus3 from "http-status-codes";
var getAllPropertiesFromDB = async (queryParams) => {
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
    limit = "9"
  } = queryParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const isAll = limit === "all";
  const pageLimit = isAll ? void 0 : Math.max(1, Number(limit) || 9);
  const skip = isAll ? void 0 : (currentPage - 1) * pageLimit;
  const insensitive = prismaNamespace_exports.QueryMode.insensitive;
  const where = {
    ...q && {
      OR: [
        { title: { contains: q, mode: insensitive } },
        { city: { contains: q, mode: insensitive } },
        { neighborhood: { contains: q, mode: insensitive } },
        { address: { contains: q, mode: insensitive } },
        { description: { contains: q, mode: insensitive } }
      ]
    },
    ...city && {
      city: { contains: city, mode: insensitive }
    },
    ...category && {
      category: {
        name: { equals: category, mode: insensitive }
      }
    },
    ...bedrooms && {
      bedrooms: bedrooms === "4" ? { gte: 4 } : Number(bedrooms)
    },
    ...minRating && {
      rating: { gte: Number(minRating) }
    },
    ...featured === "true" && {
      featured: true
    },
    ...minPrice || maxPrice ? {
      price: {
        ...minPrice && {
          gte: new prismaNamespace_exports.Decimal(minPrice)
        },
        ...maxPrice && {
          lte: new prismaNamespace_exports.Decimal(maxPrice)
        }
      }
    } : {}
  };
  const orderBy = sort === "price_low" ? [{ price: "asc" }] : sort === "price_high" ? [{ price: "desc" }] : sort === "newest" ? [{ createdAt: "desc" }] : sort === "rating" ? [{ rating: "desc" }, { reviewCount: "desc" }] : [{ featured: "desc" }, { createdAt: "desc" }];
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
            email: true
          }
        }
      }
    }),
    prisma.property.count({ where })
  ]);
  return {
    data: result.map((property) => ({
      ...property,
      price: Number(property.price)
    })),
    meta: {
      page: currentPage,
      limit: isAll ? total : pageLimit,
      total,
      totalPage: isAll ? 1 : Math.ceil(total / pageLimit)
    }
  };
};
var getPropertyByIdFromDB = async (propertyId) => {
  const result = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      landlord: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      reviews: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!result) return null;
  return {
    ...result,
    price: Number(result.price)
  };
};
var savePropertyDB = async (propertyId, userId) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  if (!property) {
    throw new AppError_default(HttpsStatus3.NOT_FOUND, "Property not found");
  }
  const existing = await prisma.savedProperty.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId
      }
    }
  });
  if (existing) return existing;
  return prisma.savedProperty.create({
    data: {
      userId,
      propertyId
    }
  });
};
var unsavePropertyDB = async (propertyId, userId) => {
  await prisma.savedProperty.deleteMany({
    where: {
      userId,
      propertyId
    }
  });
  return { propertyId };
};
var getSavedPropertiesFromDB = async (userId) => {
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
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return saved.map((s) => ({
    ...s.property,
    price: Number(s.property.price)
  }));
};
var getSuggestionsFromDB = async (q) => {
  const term = q.trim();
  if (term.length < 2) return [];
  const insensitive = prismaNamespace_exports.QueryMode.insensitive;
  const [cities, properties] = await Promise.all([
    prisma.property.findMany({
      where: {
        OR: [
          { city: { contains: term, mode: insensitive } },
          { neighborhood: { contains: term, mode: insensitive } }
        ]
      },
      distinct: ["city"],
      select: {
        city: true,
        state: true
      },
      take: 4
    }),
    prisma.property.findMany({
      where: {
        title: {
          contains: term,
          mode: insensitive
        }
      },
      select: {
        id: true,
        title: true
      },
      take: 4
    })
  ]);
  return [
    ...cities.map((city) => ({
      type: "city",
      label: `${city.city}, ${city.state}`,
      value: city.city
    })),
    ...properties.map((property) => ({
      type: "property",
      label: property.title,
      value: property.id
    }))
  ];
};
var getTrendingFromDB = async (limit = 4) => {
  const rows = await prisma.property.findMany({
    where: { available: true },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          savedBy: true,
          rentals: true
        }
      }
    }
  });
  return rows.map((property) => ({
    ...property,
    price: Number(property.price),
    trendScore: property._count.rentals * 3 + property._count.savedBy * 2 + property.reviewCount + property.rating * 2 + (property.featured ? 1 : 0)
  })).sort((a, b) => b.trendScore - a.trendScore).slice(0, limit).map(({ _count, ...rest }) => rest);
};
var propertyService = {
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
  savePropertyDB,
  unsavePropertyDB,
  getSavedPropertiesFromDB,
  getSuggestionsFromDB,
  getTrendingFromDB
};

// src/modules/property/property.controller.ts
import HttpsStatus4 from "http-status-codes";
var getAllProperties = catchAsync(async (req, res, next) => {
  const queryParams = req.query;
  const result = await propertyService.getAllPropertiesFromDB(queryParams);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.OK,
    message: "Properties retrieved successfully",
    data: result
  });
});
var getPropertyById = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const result = await propertyService.getPropertyByIdFromDB(propertyId) || [];
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.OK,
    message: "Property retrieved successfully",
    data: result
  });
});
var saveProperty = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const propertyId = req.params.id;
  const result = await propertyService.savePropertyDB(
    propertyId,
    userId
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.CREATED,
    message: "Property saved successfully",
    data: result
  });
});
var unsaveProperty = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const propertyId = req.params.id;
  const result = await propertyService.unsavePropertyDB(
    propertyId,
    userId
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.OK,
    message: "Property removed from saved list",
    data: result
  });
});
var getSavedProperties = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await propertyService.getSavedPropertiesFromDB(
    userId
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.OK,
    message: "Saved properties retrieved successfully",
    data: result
  });
});
var getSuggestions = catchAsync(async (req, res) => {
  const result = await propertyService.getSuggestionsFromDB(
    String(req.query.q ?? "")
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.OK,
    message: "Suggestions retrieved successfully",
    data: result
  });
});
var getTrending = catchAsync(async (req, res) => {
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 4));
  const result = await propertyService.getTrendingFromDB(limit);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus4.OK,
    message: "Trending properties retrieved successfully",
    data: result
  });
});
var propertyController = {
  getAllProperties,
  getPropertyById,
  saveProperty,
  unsaveProperty,
  getSavedProperties,
  getSuggestions,
  getTrending
};

// src/modules/property/property.route.ts
var router2 = Router2();
var anyRole = auth_default([Role.TENANT, Role.LANDLORD, Role.ADMIN]);
router2.get("/suggestions", propertyController.getSuggestions);
router2.get("/trending", propertyController.getTrending);
router2.get("/saved", anyRole, propertyController.getSavedProperties);
router2.get("/", propertyController.getAllProperties);
router2.get("/:id", propertyController.getPropertyById);
router2.post("/:id/save", anyRole, propertyController.saveProperty);
router2.delete("/:id/save", anyRole, propertyController.unsaveProperty);
var propertyRoute = router2;

// src/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/modules/category/category.service.ts
var createCategoryInDB = async (payload) => {
  const result = await prisma.category.create({
    data: payload
  });
  return result;
};
var getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};
var deleteCategoryInDB = async (id) => {
  const used = await prisma.property.count({ where: { categoryId: id } });
  if (used > 0) throw new AppError_default(409, "Category is used by existing properties");
  return prisma.category.delete({ where: { id } });
};
var categoryService = { createCategoryInDB, getAllCategoriesFromDB, deleteCategoryInDB };

// src/modules/category/catrgory.controller.ts
import HttpsStatus5 from "http-status-codes";
var createCategory = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const result = await categoryService.createCategoryInDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus5.CREATED,
      message: "Category created successfully",
      data: result
    });
  }
);
var getAllCategories = catchAsync(
  async (req, res, next) => {
    const result = await categoryService.getAllCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus5.OK,
      message: "Categories retrieved successfully",
      data: result
    });
  }
);
var deleteCategory = catchAsync(
  async (req, res) => {
    const result = await categoryService.deleteCategoryInDB(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus5.OK,
      message: "Category deleted successfully",
      data: result
    });
  }
);
var categoryController = {
  createCategory,
  getAllCategories,
  deleteCategory
};

// src/modules/category/category.route.ts
var router3 = Router3();
router3.post("/", auth_default([Role.ADMIN, Role.LANDLORD]), categoryController.createCategory);
router3.get("/", auth_default([Role.ADMIN, Role.LANDLORD]), categoryController.getAllCategories);
router3.delete(
  "/:id",
  auth_default([Role.ADMIN]),
  categoryController.deleteCategory
);
var categoryRoute = router3;

// src/modules/landlord/landlord.route.ts
import { Router as Router4 } from "express";

// src/modules/landlord/landlord.service.ts
import HttpsStatus6 from "http-status-codes";
var createPropertyDB = async (payload, landlordId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId
    }
  });
  if (!category) {
    throw new AppError_default(404, "Category not found");
  }
  if (!landlordId) {
    throw new AppError_default(HttpsStatus6.BAD_REQUEST, "Landlord is required");
  }
  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      neighborhood: payload.neighborhood,
      location: payload.location ?? `${payload.address}, ${payload.neighborhood}, ${payload.city}, ${payload.state}`,
      price: payload.price,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      sqft: payload.sqft,
      amenities: payload.amenities,
      images: payload.images,
      available: payload.available,
      availableFrom: payload.availableFrom ? new Date(payload.availableFrom) : null,
      rating: payload.rating,
      reviewCount: payload.reviewCount,
      featured: payload.featured,
      landlordId,
      categoryId: payload.categoryId
    }
  });
  return result;
};
var getMyPropertiesDB = async (landlordId) => {
  const result = await prisma.property.findMany({
    where: {
      landlordId
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getPropertyDB = async (propertyId, landlordId) => {
  const result = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId
    },
    include: {
      category: true
    }
  });
  if (!result) {
    throw new AppError_default(HttpsStatus6.NOT_FOUND, "Property not found or unauthorized");
  }
  return result;
};
var updatePropertyDB = async (propertyId, propertyData, landlordId) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId
    }
  });
  if (!property) {
    throw new AppError_default(HttpsStatus6.NOT_FOUND, "Property not found or unauthorized");
  }
  if (property.landlordId !== landlordId) {
    throw new AppError_default(
      HttpsStatus6.NOT_FOUND,
      "unauthorized to update this property"
    );
  }
  if (!property) {
    throw new AppError_default(HttpsStatus6.NOT_FOUND, "Property not found or unauthorized");
  }
  const result = await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      title: propertyData.title,
      description: propertyData.description,
      location: propertyData.location,
      price: propertyData.price,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      amenities: propertyData.amenities,
      images: propertyData.images,
      status: propertyData.status,
      categoryId: propertyData.categoryId
    }
  });
  return result;
};
var deletePropertyDB = async (propertyId, landlordId) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId
    }
  });
  if (!property) {
    throw new AppError_default(HttpsStatus6.NOT_FOUND, "Property not found or unauthorized");
  }
  const result = await prisma.property.delete({
    where: {
      id: propertyId
    }
  });
  return result;
};
var getAllRentalRequestsDB = async (landlordId) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId
      }
    },
    include: {
      property: true,
      tenant: {
        omit: { password: true }
      }
    }
  });
  return result;
};
var updateRentalRequestDB = async (landlordId, rentalRequestId, payload) => {
  const allowedStatuses = [
    "APPROVED",
    "REJECTED",
    "ACTIVE",
    "COMPLETED"
  ];
  if (!payload.status || !allowedStatuses.includes(payload.status)) {
    throw new AppError_default(
      HttpsStatus6.BAD_REQUEST,
      "Invalid rental request status."
    );
  }
  const request = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalRequestId,
      property: {
        landlordId
      }
    },
    include: {
      property: true
    }
  });
  if (!request) {
    throw new AppError_default(
      HttpsStatus6.NOT_FOUND,
      "Rental request not found or unauthorized"
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.rentalRequest.update({
      where: {
        id: rentalRequestId
      },
      data: {
        status: payload.status
      }
    });
    if (payload.status === "COMPLETED") {
      await tx.property.update({
        where: {
          id: request.propertyId
        },
        data: {
          available: false,
          status: PropertyStatus.UNAVAILABLE
        }
      });
    }
    if (payload.status === "ACTIVE") {
      await tx.property.update({
        where: {
          id: request.propertyId
        },
        data: {
          available: true,
          status: PropertyStatus.AVAILABLE
        }
      });
    }
    return updatedRequest;
  });
  return result;
};
var landlordService = {
  createPropertyDB,
  getMyPropertiesDB,
  getPropertyDB,
  updatePropertyDB,
  deletePropertyDB,
  getAllRentalRequestsDB,
  updateRentalRequestDB
};

// src/modules/landlord/landlord.controller.ts
import HttpsStatus7 from "http-status-codes";
var createProperty = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const result = await landlordService.createPropertyDB(req.body, landlordId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.CREATED,
    message: "Property Created Successfully",
    data: result
  });
});
var getMyProperties = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const result = await landlordService.getMyPropertiesDB(landlordId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.OK,
    message: "Properties Retrieved Successfully",
    data: result
  });
});
var getProperty = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const id = req.params.id;
  const result = await landlordService.getPropertyDB(id, landlordId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.OK,
    message: "Property Retrieved Successfully",
    data: result
  });
});
var updateProperty = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const id = req.params.id;
  const result = await landlordService.updatePropertyDB(id, req.body, landlordId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.OK,
    message: "Property Modified Successfully",
    data: result
  });
});
var deleteProperty = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const id = req.params.id;
  const result = await landlordService.deletePropertyDB(id, landlordId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.OK,
    message: "Property Deleted Successfully",
    data: result
  });
});
var getAllRentalRequests = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const result = await landlordService.getAllRentalRequestsDB(landlordId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.OK,
    message: "Rental Request Retrieve Successfully",
    data: result
  });
});
var updateRentalRequest = catchAsync(async (req, res, next) => {
  const landlordId = req.user?.id;
  const requestId = req.params.id;
  const result = await landlordService.updateRentalRequestDB(landlordId, requestId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus7.OK,
    message: "Rental Request Updated Successfully",
    data: result
  });
});
var landlordController = {
  createProperty,
  getMyProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getAllRentalRequests,
  updateRentalRequest
};

// src/modules/landlord/landlord.route.ts
var router4 = Router4();
router4.post("/properties", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.createProperty);
router4.get("/properties", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.getMyProperties);
router4.get("/properties/:id", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.getProperty);
router4.put("/properties/:id", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.updateProperty);
router4.delete("/properties/:id", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.deleteProperty);
router4.get("/requests", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.getAllRentalRequests);
router4.patch("/requests/:id", auth_default([Role.LANDLORD, Role.ADMIN]), landlordController.updateRentalRequest);
var landlordRouter = router4;

// src/modules/rentalRequest/rental.route.ts
import { Router as Router5 } from "express";

// src/modules/rentalRequest/rental.service.ts
import HttpsStatus8 from "http-status-codes";
var createRequest = async (payload, tenantId) => {
  const { propertyId, message, startDate, endDate } = payload;
  if (!propertyId) {
    throw new AppError_default(HttpsStatus8.BAD_REQUEST, "propertyId is required");
  }
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  if (!property) {
    throw new AppError_default(HttpsStatus8.NOT_FOUND, "Property not found");
  }
  if (!property.available) {
    throw new AppError_default(
      HttpsStatus8.BAD_REQUEST,
      "This property is not currently available for rent"
    );
  }
  if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
    throw new AppError_default(
      HttpsStatus8.BAD_REQUEST,
      "End date must be after the start date"
    );
  }
  const existing = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: {
        in: [
          RequestStatus.PENDING,
          RequestStatus.APPROVED,
          RequestStatus.ACTIVE
        ]
      }
    }
  });
  if (existing) {
    throw new AppError_default(
      HttpsStatus8.CONFLICT,
      "You already have an active request for this property"
    );
  }
  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      message,
      startDate: startDate ? new Date(startDate) : void 0,
      endDate: endDate ? new Date(endDate) : void 0
    },
    include: {
      property: true
    }
  });
  return result;
};
var getRequestByTenantIdDB = async (tenantId) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId
    },
    include: {
      property: true
    }
  });
  return result;
};
var getRequestByRequestIdDB = async (requestId, userId, role) => {
  const result = await prisma.rentalRequest.findFirst({
    where: {
      id: requestId,
      ...role !== Role.ADMIN ? { tenantId: userId } : {}
    },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      payment: true
    }
  });
  return result;
};
var requestService = { createRequest, getRequestByTenantIdDB, getRequestByRequestIdDB };

// src/modules/rentalRequest/rental.controller.ts
import HttsStatus from "http-status-codes";
var createRequest2 = catchAsync(async (req, res, next) => {
  const tenantId = req.user?.id;
  const result = await requestService.createRequest(req.body, tenantId);
  sendResponse(res, {
    success: true,
    statusCode: HttsStatus.CREATED,
    message: "Rental  Request Has Been Created",
    data: result
  });
});
var getRequestByTenantId = catchAsync(async (req, res, next) => {
  const tenantId = req.user?.id;
  const result = await requestService.getRequestByTenantIdDB(tenantId);
  sendResponse(res, {
    success: true,
    statusCode: HttsStatus.OK,
    message: "Rental  Request Has Been Fetched",
    data: result
  });
});
var getRequestByRequestId = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;
  const userId = req.user?.id;
  const role = req.user?.role;
  const result = await requestService.getRequestByRequestIdDB(requestId, userId, role) || [];
  sendResponse(res, {
    success: true,
    statusCode: HttsStatus.OK,
    message: "Rental  Request Has Been Fetched",
    data: result
  });
});
var requestController = { createRequest: createRequest2, getRequestByTenantId, getRequestByRequestId };

// src/modules/rentalRequest/rental.route.ts
var router5 = Router5();
router5.post("/", auth_default([Role.TENANT, Role.ADMIN]), requestController.createRequest);
router5.get("/", auth_default([Role.TENANT, Role.ADMIN]), requestController.getRequestByTenantId);
router5.get("/:id", auth_default([Role.TENANT, Role.ADMIN]), requestController.getRequestByRequestId);
var requestRoute = router5;

// src/modules/admin/admin.route.ts
import { Router as Router6 } from "express";

// src/modules/admin/admin.service.ts
import HttpsStatus9 from "http-status-codes";
var getAllUserDB = async ({ page, limit, role }) => {
  const where = role ? { role } : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      omit: {
        password: true
      },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: users
  };
};
var updateUserStatusDB = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(HttpsStatus9.NOT_FOUND, "User not found");
  }
  if (user.role === Role.ADMIN) {
    throw new AppError_default(
      HttpsStatus9.FORBIDDEN,
      "Admin user cannot be banned"
    );
  }
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned: payload.isBanned }
  });
  return result;
};
var getAllPropertiesDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: {
        omit: {
          password: true
        }
      },
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result.map((property) => ({
    ...property,
    price: Number(property.price)
  }));
};
var updatePropertyStatusDB = async (propertyId, payload) => {
  const allowedStatuses = [
    PropertyStatus.AVAILABLE,
    PropertyStatus.UNAVAILABLE
  ];
  if (!payload.status || !allowedStatuses.includes(payload.status)) {
    throw new AppError_default(
      HttpsStatus9.BAD_REQUEST,
      "Invalid property status."
    );
  }
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  if (!property) {
    throw new AppError_default(HttpsStatus9.NOT_FOUND, "Property not found");
  }
  const result = await prisma.property.update({
    where: { id: propertyId },
    data: {
      status: payload.status,
      available: payload.status === PropertyStatus.AVAILABLE
    }
  });
  return result;
};
var deletePropertyDB2 = async (propertyId) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  if (!property) {
    throw new AppError_default(HttpsStatus9.NOT_FOUND, "Property not found");
  }
  const result = await prisma.property.delete({
    where: { id: propertyId }
  });
  return result;
};
var getAllRentalsDB = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        omit: {
          password: true
        }
      },
      property: true
    }
  });
  return result;
};
var meanStd = (v) => {
  const n = v.length || 1;
  const mean = v.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    v.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  );
  return { mean, std };
};
var getAnalyticsDB = async () => {
  const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const months2 = [];
  for (let i = 5; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months2.push(monthKey(d));
  }
  const sixMonthsAgo = /* @__PURE__ */ new Date();
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setHours(0, 0, 0, 0);
  const [
    requests,
    users,
    properties,
    payments,
    statusGroups
  ] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    }),
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    }),
    prisma.property.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        price: true
      }
    }),
    prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        paidAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        amount: true,
        paidAt: true
      }
    }),
    prisma.rentalRequest.groupBy({
      by: ["status"],
      _count: {
        _all: true
      }
    })
  ]);
  const monthly = months2.map((m) => ({
    month: m,
    requests: requests.filter(
      (r) => monthKey(r.createdAt) === m
    ).length,
    users: users.filter(
      (u) => monthKey(u.createdAt) === m
    ).length,
    revenue: payments.filter((p) => p.paidAt && monthKey(p.paidAt) === m).reduce((sum, p) => sum + Number(p.amount), 0)
  }));
  const cityCount = /* @__PURE__ */ new Map();
  properties.forEach((p) => {
    cityCount.set(
      p.city,
      (cityCount.get(p.city) ?? 0) + 1
    );
  });
  const topCities = [...cityCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([city, count]) => ({ city, count }));
  const anomalies = [];
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const daily = days.map(
    (day) => requests.filter(
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
          detail: `${value} requests vs a daily average of ${dMean.toFixed(1)}.`
        });
      }
    });
  }
  const byCity = /* @__PURE__ */ new Map();
  properties.forEach((p) => {
    const list = byCity.get(p.city) ?? [];
    list.push({
      title: p.title,
      price: Number(p.price)
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
          detail: `$${x.price.toLocaleString()} vs a city average of $${Math.round(mean).toLocaleString()}.`
        });
      }
    });
  });
  const insights = [];
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];
  if (prev && prev.requests > 0) {
    const pct = Math.round(
      (last.requests - prev.requests) / prev.requests * 100
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
      value: g._count._all
    })),
    topCities,
    anomalies,
    insights
  };
};
var getAllPaymentsDB = async () => {
  const rows = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      rentalRequest: {
        include: {
          property: {
            select: {
              title: true
            }
          }
        }
      }
    }
  });
  return rows.map((p) => ({
    ...p,
    amount: Number(p.amount)
  }));
};
var getMessagesDB = () => prisma.contactMessage.findMany({
  orderBy: {
    createdAt: "desc"
  }
});
var adminService = {
  getAllUserDB,
  updateUserStatusDB,
  getAllPropertiesDB,
  updatePropertyStatusDB,
  deletePropertyDB: deletePropertyDB2,
  getAllRentalsDB,
  getAnalyticsDB,
  getAllPaymentsDB,
  getMessagesDB
};

// src/modules/admin/admin.controller.ts
import HttpsStatus10 from "http-status-codes";
var getAllUser = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const role = req.query.role;
  const result = await adminService.getAllUserDB({
    page,
    limit,
    role
  });
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus10.OK,
    message: "All users retrieved successfully",
    data: result
  });
});
var updateUserStatus = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const result = await adminService.updateUserStatusDB(
      id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "User Status Updated Successfully",
      data: result
    });
  }
);
var getAllProperties2 = catchAsync(
  async (req, res, next) => {
    const result = await adminService.getAllPropertiesDB();
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "All Properties Retrieve Successfully",
      data: result
    });
  }
);
var updatePropertyStatus = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const result = await adminService.updatePropertyStatusDB(
      id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "Property Status Updated Successfully",
      data: result
    });
  }
);
var deleteProperty2 = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const result = await adminService.deletePropertyDB(id);
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "Property Deleted Successfully",
      data: result
    });
  }
);
var getAllRentals = catchAsync(
  async (req, res, next) => {
    const result = await adminService.getAllRentalsDB();
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "All Rental Request Retrieve Successfully",
      data: result
    });
  }
);
var getAnalytics = catchAsync(
  async (req, res) => {
    const result = await adminService.getAnalyticsDB();
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "Analytics retrieved",
      data: result
    });
  }
);
var getAllPayments = catchAsync(
  async (_req, res) => {
    const result = await adminService.getAllPaymentsDB();
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "Payments",
      data: result
    });
  }
);
var getMessages = catchAsync(
  async (_req, res) => {
    const result = await adminService.getMessagesDB();
    sendResponse(res, {
      success: true,
      statusCode: HttpsStatus10.OK,
      message: "Messages",
      data: result
    });
  }
);
var adminController = {
  getAllUser,
  updateUserStatus,
  getAllRentals,
  getAllProperties: getAllProperties2,
  updatePropertyStatus,
  deleteProperty: deleteProperty2,
  getAnalytics,
  getAllPayments,
  getMessages
};

// src/modules/admin/admin.route.ts
var router6 = Router6();
router6.get("/users", auth_default([Role.ADMIN]), adminController.getAllUser);
router6.patch("/users/:id", auth_default([Role.ADMIN]), adminController.updateUserStatus);
router6.get("/properties", auth_default([Role.ADMIN]), adminController.getAllProperties);
router6.patch("/properties/:id", auth_default([Role.ADMIN]), adminController.updatePropertyStatus);
router6.delete("/properties/:id", auth_default([Role.ADMIN]), adminController.deleteProperty);
router6.get("/rentals", auth_default([Role.ADMIN]), adminController.getAllRentals);
router6.get("/analytics", auth_default([Role.ADMIN]), adminController.getAnalytics);
router6.get("/payments", auth_default([Role.ADMIN]), adminController.getAllPayments);
router6.get("/messages", auth_default([Role.ADMIN]), adminController.getMessages);
var adminRoute = router6;

// src/modules/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/modules/payment/payment.controller.ts
import HttpStatus2 from "http-status-codes";

// src/modules/payment/payment.service.ts
import HttpStatus from "http-status-codes";

// src/config/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config.stripe_secret_key);
var stripe_default = stripe;

// src/modules/payment/payment.service.ts
var createPaymentIntoDB = async (payload, tenantId) => {
  const { rentalRequestId } = payload;
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId
    },
    include: {
      property: true,
      tenant: {
        omit: {
          password: true
        }
      }
    }
  });
  if (!rental) {
    throw new AppError_default(
      HttpStatus.NOT_FOUND,
      "Rental request not found"
    );
  }
  if (rental.tenantId !== tenantId) {
    throw new AppError_default(
      HttpStatus.FORBIDDEN,
      "You are not allowed to pay"
    );
  }
  if (rental.status !== RequestStatus.APPROVED) {
    throw new AppError_default(
      HttpStatus.BAD_REQUEST,
      "Rental request is not approved"
    );
  }
  const existingPayment = await prisma.payment.findFirst({
    where: { rentalRequestId, status: PaymentStatus.COMPLETED }
  });
  if (existingPayment) {
    throw new AppError_default(HttpStatus.CONFLICT, "Payment already completed for this rental request");
  }
  await prisma.payment.deleteMany({
    where: { rentalRequestId, status: { not: PaymentStatus.COMPLETED } }
  });
  const session = await stripe_default.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: rental.tenant.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(rental.property.price) * 100),
          product_data: {
            name: rental.property.title
          }
        }
      }
    ],
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      tenantId,
      rentalRequestId
    }
  });
  await prisma.payment.create({
    data: {
      transactionId: session.id,
      amount: Number(rental.property.price),
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
      rentalRequestId,
      userId: tenantId,
      paidAt: null
    }
  });
  return {
    checkoutUrl: session.url,
    transactionId: session.id
  };
};
var confirmPaymentIntoDB = async (payload, signature) => {
  try {
    const event = stripe_default.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret
    );
    if (event.type !== "checkout.session.completed") {
      return {
        status: "IGNORED"
      };
    }
    const session = event.data.object;
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: {
          transactionId: session.id
        },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.rentalRequest.update({
        where: {
          id: payment.rentalRequestId
        },
        data: {
          status: RequestStatus.ACTIVE
        }
      });
    });
    return {
      status: "SUCCESS"
    };
  } catch (error) {
    throw new AppError_default(
      HttpStatus.BAD_REQUEST,
      error.message
    );
  }
};
var verifyPayment = async (sessionId) => {
  const session = await stripe_default.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new AppError_default(HttpStatus.BAD_REQUEST, "Payment not completed");
  }
  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId: session.id },
    include: { rentalRequest: true }
  });
  if (!existingPayment) {
    throw new AppError_default(HttpStatus.NOT_FOUND, "Payment not found");
  }
  if (existingPayment.status !== PaymentStatus.COMPLETED) {
    const updated = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { transactionId: session.id },
        data: { status: PaymentStatus.COMPLETED, paidAt: /* @__PURE__ */ new Date() }
      });
      await tx.rentalRequest.update({
        where: { id: payment.rentalRequestId },
        data: { status: RequestStatus.ACTIVE }
      });
      return payment;
    });
    return { ...existingPayment, ...updated };
  }
  return existingPayment;
};
var getPaymentHistoryDB = async (userId) => {
  return prisma.payment.findMany({
    where: {
      userId
    },
    include: {
      rentalRequest: {
        include: {
          property: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getPaymentDetailsDB = async (paymentId, userId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      userId
    },
    include: {
      rentalRequest: true
    }
  });
  if (!payment) {
    throw new AppError_default(
      HttpStatus.NOT_FOUND,
      "Payment not found"
    );
  }
  return payment;
};
var paymentService = {
  createPaymentIntoDB,
  confirmPaymentIntoDB,
  verifyPayment,
  getPaymentHistoryDB,
  getPaymentDetailsDB
};

// src/modules/payment/payment.controller.ts
var createPayment = catchAsync(async (req, res) => {
  const tenantId = req.user?.id;
  const result = await paymentService.createPaymentIntoDB(
    req.body,
    tenantId
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus2.CREATED,
    message: "Payment session created successfully",
    data: result
  });
});
var confirmPayment = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    throw new AppError_default(
      HttpStatus2.BAD_REQUEST,
      "Stripe signature missing"
    );
  }
  const result = await paymentService.confirmPaymentIntoDB(
    req.body,
    signature
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus2.OK,
    message: "Payment confirmed successfully",
    data: result
  });
});
var verifyPayment2 = catchAsync(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    throw new AppError_default(
      HttpStatus2.BAD_REQUEST,
      "Session ID is required"
    );
  }
  const result = await paymentService.verifyPayment(sessionId);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus2.OK,
    message: "Payment verified successfully",
    data: result
  });
});
var getPaymentHistory = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await paymentService.getPaymentHistoryDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus2.OK,
    message: "Payment history retrieved successfully",
    data: result
  });
});
var getPaymentDetails = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await paymentService.getPaymentDetailsDB(
    req.params.id,
    userId
  );
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus2.OK,
    message: "Payment details retrieved successfully",
    data: result
  });
});
var paymentController = {
  createPayment,
  confirmPayment,
  verifyPayment: verifyPayment2,
  getPaymentHistory,
  getPaymentDetails
};

// src/modules/payment/payment.route.ts
var router7 = Router7();
router7.post(
  "/create",
  auth_default([Role.TENANT, Role.ADMIN]),
  paymentController.createPayment
);
router7.post("/confirm", paymentController.confirmPayment);
router7.post(
  "/verify",
  auth_default([Role.TENANT, Role.ADMIN]),
  paymentController.verifyPayment
);
router7.get("/history", auth_default([Role.TENANT, Role.ADMIN]), paymentController.getPaymentHistory);
router7.get(
  "/:id",
  auth_default([Role.TENANT, Role.ADMIN]),
  paymentController.getPaymentDetails
);
var paymentRoute = router7;

// src/modules/review/review.route.ts
import { Router as Router8 } from "express";

// src/modules/review/review.service.ts
import HttpsStatus11 from "http-status-codes";
var createReviewDB = async (payload, tenantId) => {
  const propertyId = payload.propertyId;
  const request = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId
    },
    include: {
      payment: true
    }
  });
  if (!request) {
    throw new AppError_default(HttpsStatus11.NOT_FOUND, "Rental request not found for the specified property");
  }
  const completedPayment = request.payment.find(
    (payment) => payment.status === PaymentStatus.COMPLETED
  );
  if (!completedPayment) {
    throw new AppError_default(
      HttpsStatus11.BAD_REQUEST,
      "Payment not completed for the specified property"
    );
  }
  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      propertyId,
      tenantId
    }
  });
  return result;
};
var getReviewsByPropertyDB = async (propertyId) => {
  const result = await prisma.review.findMany({
    where: { propertyId },
    include: {
      tenant: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getLatestReviewsDB = async (limit = 3) => prisma.review.findMany({
  where: { rating: { gte: 4 }, comment: { not: null } },
  orderBy: { createdAt: "desc" },
  take: limit,
  select: {
    id: true,
    rating: true,
    comment: true,
    createdAt: true,
    tenant: { select: { name: true } },
    property: { select: { id: true, title: true, city: true } }
  }
});
var reviewService = {
  createReviewDB,
  getReviewsByPropertyDB,
  getLatestReviewsDB
};

// src/modules/review/review.controller.ts
import HttpsStatus12 from "http-status-codes";
var createReview = catchAsync(async (req, res, next) => {
  const tenantId = req.user?.id;
  const result = await reviewService.createReviewDB(req.body, tenantId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus12.CREATED,
    message: "Review Created Successfully",
    data: result
  });
});
var getReviewsByProperty = catchAsync(async (req, res, next) => {
  const propertyId = req.params.propertyId;
  const result = await reviewService.getReviewsByPropertyDB(propertyId);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus12.OK,
    message: "Reviews Retrieved Successfully",
    data: result
  });
});
var getLatestReviews = catchAsync(async (req, res) => {
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 3));
  const result = await reviewService.getLatestReviewsDB(limit);
  sendResponse(res, { success: true, statusCode: HttpsStatus12.OK, message: "Latest reviews retrieved", data: result });
});
var reviewController = { createReview, getReviewsByProperty, getLatestReviews };

// src/modules/review/review.route.ts
var router8 = Router8();
router8.post("/", auth_default([Role.TENANT, Role.ADMIN]), reviewController.createReview);
router8.get("/latest", reviewController.getLatestReviews);
router8.get("/property/:propertyId", reviewController.getReviewsByProperty);
var reviewRouter = router8;

// src/modules/upload/upload.route.ts
import { Router as Router9 } from "express";

// src/middlewares/upload.ts
import multer from "multer";
var ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
var MAX_FILE_SIZE = 5 * 1024 * 1024;
var fileFilter = (_req, file, cb) => {
  if (!ACCEPTED_TYPES.includes(file.mimetype)) {
    return cb(new AppError_default(400, "Only JPG, PNG, WEBP, or AVIF images are allowed"));
  }
  cb(null, true);
};
var upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 }
});

// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
  secure: true
});
var cloudinary_default = cloudinary;

// src/modules/upload/upload.service.ts
import HttpsStatus13 from "http-status-codes";
var uploadBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary_default.uploader.upload_stream(
      {
        folder: "rentnest/properties",
        resource_type: "image",
        // keeps payload reasonable without visibly degrading quality
        transformation: [{ width: 1920, height: 1920, crop: "limit", quality: "auto" }]
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new AppError_default(HttpsStatus13.BAD_GATEWAY, error?.message || "Upload failed")
          );
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};
var uploadImagesToCloudinary = async (files) => {
  const urls = await Promise.all(files.map((file) => uploadBuffer(file.buffer)));
  return urls;
};
var uploadService = { uploadImagesToCloudinary };

// src/modules/upload/upload.controller.ts
import HttpsStatus14 from "http-status-codes";
var uploadImages = catchAsync(async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    throw new AppError_default(HttpsStatus14.BAD_REQUEST, "No files uploaded");
  }
  const urls = await uploadService.uploadImagesToCloudinary(files);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus14.CREATED,
    message: "Images uploaded successfully",
    data: { urls }
  });
});
var uploadController = { uploadImages };

// src/modules/upload/upload.route.ts
var router9 = Router9();
router9.post(
  "/images",
  auth_default([Role.LANDLORD, Role.ADMIN]),
  upload.array("images", 10),
  uploadController.uploadImages
);
var uploadRoute = router9;

// src/modules/contact/contact.route.ts
import { Router as Router10 } from "express";

// src/modules/contact/contact.controller.ts
import HttpsStatus16 from "http-status-codes";

// src/modules/contact/contact.service.ts
import HttpsStatus15 from "http-status-codes";
var createMessageDB = async (p) => {
  const name = p.name?.trim();
  const email = p.email?.trim();
  const subject = p.subject?.trim();
  const message = p.message?.trim();
  if (!name || !email || !subject || !message) {
    throw new AppError_default(HttpsStatus15.BAD_REQUEST, "All fields are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError_default(HttpsStatus15.BAD_REQUEST, "Enter a valid email");
  }
  if (message.length < 10 || message.length > 2e3) {
    throw new AppError_default(HttpsStatus15.BAD_REQUEST, "Message must be 10\u20132000 characters");
  }
  return prisma.contactMessage.create({ data: { name, email, subject, message } });
};
var contactService = { createMessageDB };

// src/modules/contact/contact.controller.ts
var createMessage = catchAsync(async (req, res) => {
  const result = await contactService.createMessageDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus16.CREATED,
    message: "Message sent successfully",
    data: { id: result.id }
  });
});
var contactController = { createMessage };

// src/modules/contact/contact.route.ts
var router10 = Router10();
router10.post("/", contactController.createMessage);
var contactRoute = router10;

// src/modules/stats/stats.route.ts
import { Router as Router11 } from "express";

// src/modules/stats/stats.controller.ts
import HttpsStatus17 from "http-status-codes";

// src/modules/stats/stats.service.ts
var months = () => Array.from({ length: 6 }, (_, i) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() - (5 - i));
  return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }), start: d };
});
var bucket = (rows) => months().map((m) => ({
  month: m.label,
  value: Math.round(
    rows.filter((r) => `${r.date.getFullYear()}-${r.date.getMonth()}` === m.key).reduce((s, r) => s + r.value, 0) * 100
  ) / 100
}));
var insightsFor = (label, series) => {
  const out = [];
  const last = series.at(-1)?.value ?? 0;
  const prev = series.at(-2)?.value ?? 0;
  const history = series.slice(0, -1).map((s) => s.value);
  const mean = history.reduce((a, b) => a + b, 0) / (history.length || 1);
  const sd = Math.sqrt(history.reduce((a, b) => a + (b - mean) ** 2, 0) / (history.length || 1));
  if (prev > 0) {
    const pct = Math.round((last - prev) / prev * 100);
    if (pct !== 0) out.push(`${label} ${pct > 0 ? "rose" : "fell"} ${Math.abs(pct)}% compared with last month.`);
  }
  if (sd > 0 && Math.abs(last - mean) > 2 * sd)
    out.push(`Unusual activity: ${label.toLowerCase()} this month (${last}) is far from the recent average (${mean.toFixed(1)}).`);
  return out;
};
var getPublicStatsDB = async () => {
  const [totalProperties, totalTenants, totalLandlords, ratingAgg, cities, categories, reviews, rentedCount] = await Promise.all([
    prisma.property.count({ where: { available: true } }),
    prisma.user.count({ where: { role: Role.TENANT } }),
    prisma.user.count({ where: { role: Role.LANDLORD } }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
    prisma.property.groupBy({ by: ["city", "state"], _count: { _all: true }, orderBy: { _count: { city: "desc" } }, take: 6 }),
    prisma.category.findMany({ select: { id: true, name: true, _count: { select: { properties: true } } } }),
    prisma.review.findMany({
      where: { comment: { not: null }, rating: { gte: 4 } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        rating: true,
        comment: true,
        tenant: { select: { name: true } },
        property: { select: { id: true, title: true, city: true } }
      }
    }),
    prisma.rentalRequest.count({ where: { status: { in: [RequestStatus.ACTIVE, RequestStatus.COMPLETED] } } })
  ]);
  return {
    totalProperties,
    totalTenants,
    totalLandlords,
    rentedCount,
    totalReviews: ratingAgg._count,
    avgRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
    cities: cities.map((c) => ({ city: c.city, state: c.state, count: c._count._all })),
    categories: categories.map((c) => ({ id: c.id, name: c.name, count: c._count.properties })),
    reviews
  };
};
var getDashboardStatsDB = async (user) => {
  const since = months()[0].start;
  const { id, role } = user;
  const requestWhere = role === Role.ADMIN ? {} : role === Role.LANDLORD ? { property: { landlordId: id } } : { tenantId: id };
  const paymentWhere = role === Role.ADMIN ? {} : role === Role.LANDLORD ? { rentalRequest: { property: { landlordId: id } } } : { userId: id };
  const [status, requests, payments, paidAgg] = await Promise.all([
    prisma.rentalRequest.groupBy({ by: ["status"], where: requestWhere, _count: { _all: true } }),
    prisma.rentalRequest.findMany({ where: { ...requestWhere, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.payment.findMany({
      where: { ...paymentWhere, status: PaymentStatus.COMPLETED, paidAt: { gte: since } },
      select: { paidAt: true, amount: true }
    }),
    prisma.payment.aggregate({ where: { ...paymentWhere, status: PaymentStatus.COMPLETED }, _sum: { amount: true } })
  ]);
  let extra = null;
  if (role === Role.ADMIN) {
    const cats = await prisma.category.findMany({ select: { name: true, _count: { select: { properties: true } } } });
    extra = { title: "Properties by category", data: cats.map((c) => ({ name: c.name, value: c._count.properties })) };
  } else if (role === Role.LANDLORD) {
    const props = await prisma.property.findMany({
      where: { landlordId: id },
      take: 6,
      orderBy: { rentals: { _count: "desc" } },
      select: { title: true, _count: { select: { rentals: true } } }
    });
    extra = { title: "Requests per property", data: props.map((p) => ({ name: p.title.slice(0, 18), value: p._count.rentals })) };
  }
  const requestsByMonth = bucket(requests.map((r) => ({ date: r.createdAt, value: 1 })));
  const moneyByMonth = bucket(payments.map((p) => ({ date: p.paidAt, value: Number(p.amount) })));
  const moneyLabel = role === Role.TENANT ? "Rent paid" : role === Role.LANDLORD ? "Earnings" : "Revenue";
  return {
    statusBreakdown: status.map((s) => ({ name: s.status, value: s._count._all })),
    requestsByMonth,
    moneyByMonth,
    moneyLabel,
    totalMoney: Number(paidAgg._sum.amount ?? 0),
    extra,
    insights: [...insightsFor("Rental requests", requestsByMonth), ...insightsFor(moneyLabel, moneyByMonth)]
  };
};
var statsService = { getPublicStatsDB, getDashboardStatsDB };

// src/modules/stats/stats.controller.ts
var getPublic = catchAsync(async (_req, res) => sendResponse(res, { success: true, statusCode: HttpsStatus17.OK, message: "Stats", data: await statsService.getPublicStatsDB() }));
var getDashboard = catchAsync(async (req, res) => sendResponse(res, {
  success: true,
  statusCode: HttpsStatus17.OK,
  message: "Dashboard stats",
  data: await statsService.getDashboardStatsDB({ id: req.user.id, role: req.user.role })
}));
var statsController = { getPublic, getDashboard };

// src/modules/stats/stats.route.ts
var router11 = Router11();
router11.get("/public", statsController.getPublic);
router11.get("/dashboard", auth_default([Role.ADMIN, Role.LANDLORD, Role.TENANT]), statsController.getDashboard);
var statsRoute = router11;

// src/modules/ai/ai.route.ts
import { Router as Router12 } from "express";
import rateLimit from "express-rate-limit";

// src/modules/ai/ai.controller.ts
import HttpsStatus18 from "http-status-codes";

// src/modules/ai/ai.service.ts
import Anthropic from "@anthropic-ai/sdk";
var client = new Anthropic({ apiKey: config.anthropic_api_key });
var text = (msg) => msg.content.flatMap((b) => b.type === "text" ? [b.text] : []).join("");
var parseSearchQuery = async (query) => {
  const [cats, cities] = await Promise.all([
    prisma.category.findMany({ select: { name: true } }),
    prisma.property.findMany({ distinct: ["city"], select: { city: true } })
  ]);
  const msg = await client.messages.create({
    model: config.ai_model,
    max_tokens: 300,
    system: `Convert a rental search request into JSON filters. Reply with JSON only, no prose. Allowed keys (omit unknown ones): q, city, category, minPrice, maxPrice, bedrooms, minRating, sort. category must be one of: ${cats.map((c) => c.name).join(", ")}. city should be one of: ${cities.map((c) => c.city).join(", ")}. sort is one of: price_low, price_high, newest, rating. Use "q" only for leftover keywords.`,
    messages: [{ role: "user", content: query.slice(0, 300) }]
  });
  try {
    const raw3 = JSON.parse(text(msg).replace(/```json|```/g, "").trim());
    const allowed = ["q", "city", "category", "minPrice", "maxPrice", "bedrooms", "minRating", "sort"];
    return Object.fromEntries(
      Object.entries(raw3).filter(([k, v]) => allowed.includes(k) && v !== null && v !== "").map(([k, v]) => [k, String(v)])
    );
  } catch {
    return { q: query };
  }
};
var chat = async (messages) => {
  const props = await prisma.property.findMany({
    where: { available: true },
    take: 20,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      city: true,
      state: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      category: { select: { name: true } }
    }
  });
  const catalog = props.map(
    (p) => `- ${p.title} | ${p.category.name} | ${p.city}, ${p.state} | $${Number(p.price)}/mo | ${p.bedrooms ?? 0}bd/${p.bathrooms ?? 0}ba | /properties/${p.id}`
  ).join("\n");
  const msg = await client.messages.create({
    model: config.ai_model,
    max_tokens: 500,
    system: `You are RentNest's assistant. Be concise and friendly. How the platform works: tenants send a rental request (move-in date + message); the landlord approves or rejects it; once approved the tenant pays the first month via Stripe Checkout and the rental becomes ACTIVE; after completion the tenant can leave a review. Only recommend listings from this catalog and write each listing's link exactly as /properties/<id>:
${catalog}
If you don't know something, say so and suggest the Contact page.`,
    messages
  });
  return text(msg);
};
var aiService = { parseSearchQuery, chat };

// src/modules/ai/ai.controller.ts
var search = catchAsync(async (req, res) => {
  const query = String(req.body?.query ?? "").trim();
  if (!query) throw new AppError_default(HttpsStatus18.BAD_REQUEST, "Query is required");
  sendResponse(res, { success: true, statusCode: HttpsStatus18.OK, message: "Parsed", data: await aiService.parseSearchQuery(query) });
});
var chat2 = catchAsync(async (req, res) => {
  const raw3 = Array.isArray(req.body?.messages) ? req.body.messages.slice(-10) : [];
  const clean = raw3.filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim()).map((m) => ({ role: m.role, content: m.content.slice(0, 1e3) }));
  while (clean[0]?.role === "assistant") clean.shift();
  if (!clean.length) throw new AppError_default(HttpsStatus18.BAD_REQUEST, "Message is required");
  sendResponse(res, { success: true, statusCode: HttpsStatus18.OK, message: "Reply", data: { reply: await aiService.chat(clean) } });
});
var aiController = { search, chat: chat2 };

// src/modules/ai/ai.route.ts
var limiter = rateLimit({ windowMs: 6e4, limit: 15, standardHeaders: true, legacyHeaders: false });
var router12 = Router12();
router12.post("/chat", limiter, aiController.chat);
router12.post("/search", limiter, aiController.search);
var aiRoute = router12;

// src/modules/newsletter/newsletter.route.ts
import { Router as Router13 } from "express";
import HttpsStatus19 from "http-status-codes";
var router13 = Router13();
router13.post("/", catchAsync(async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError_default(HttpsStatus19.BAD_REQUEST, "Enter a valid email");
  await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
  sendResponse(res, { success: true, statusCode: HttpsStatus19.CREATED, message: "Subscribed", data: {} });
}));
var newsletterRoute = router13;

// src/app.ts
var app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: [config.app_url, config.server_url, "http://localhost:3000"],
  credentials: true
}));
app.use("/api/payments/confirm", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path3.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/landlord", landlordRouter);
app.use("/api/rentals", requestRoute);
app.use("/api/admin", adminRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/uploads", uploadRoute);
app.use("/api/contact", contactRoute);
app.use("/api/stats", statsRoute);
app.use("/api/ai", aiRoute);
app.use("/api/newsletter", newsletterRoute);
app.use(globalErrorHandler);
app.get("/", (req, res) => {
  res.status(HttpsStatus20.ACCEPTED).json({
    success: true,
    message: "RentNest App APIs Is running"
  });
});
var app_default = app;

// src/server.ts
async function main() {
  try {
    await prisma.$connect();
    console.log("Database Connected Successfully");
    app_default.listen(config.port, () => {
      console.log(`RentNest app listening on port ${config.port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.mjs.map