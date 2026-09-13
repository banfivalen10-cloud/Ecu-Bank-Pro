import { bigint, boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  membershipStatus: mysqlEnum("membershipStatus", ["free", "vip_lifetime", "vip_monthly"]).default("free").notNull(),
  membershipExpiresAt: timestamp("membershipExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const modules = mysqlTable("modules", {
  id: varchar("id", { length: 64 }).primaryKey(),
  code: varchar("code", { length: 32 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 64 }).notNull(),
  accentColor: varchar("accentColor", { length: 32 }).notNull().default("#38bdf8"),
  tags: text("tags").notNull(),
  fileCountEstimate: int("fileCountEstimate").notNull().default(0),
  driveFolderId: varchar("driveFolderId", { length: 128 }),
  orderIndex: int("orderIndex").notNull().default(0),
  requiresVip: boolean("requiresVip").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

export const driveFiles = mysqlTable("drive_files", {
  id: varchar("id", { length: 64 }).primaryKey(),
  moduleId: varchar("moduleId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  extension: varchar("extension", { length: 32 }).notNull(),
  sizeBytes: bigint("sizeBytes", { mode: "number" }).notNull().default(0),
  driveId: varchar("driveId", { length: 128 }),
  driveWebLink: text("driveWebLink"),
  downloadUrl: text("downloadUrl"),
  brand: varchar("brand", { length: 64 }),
  ecuType: varchar("ecuType", { length: 64 }),
  softwareName: varchar("softwareName", { length: 128 }),
  version: varchar("version", { length: 64 }),
  description: text("description"),
  tags: text("tags"),
  isVerified: boolean("isVerified").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DriveFile = typeof driveFiles.$inferSelect;
export type InsertDriveFile = typeof driveFiles.$inferInsert;

export const purchases = mysqlTable("purchases", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  planName: varchar("planName", { length: 64 }).notNull(),
  amountUsd: int("amountUsd").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("completed").notNull(),
  referenceCode: varchar("referenceCode", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;
