import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for database sessions
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  profileName: text("profile_name").notNull(),
  citation: text("citation").notNull(),
  radarData: jsonb("radar_data").notNull(),
  parfums: jsonb("parfums").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sampleOrders = pgTable("sample_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  quizResultId: integer("quiz_result_id").references(() => quizResults.id),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").notNull().default("pending"), // pending, paid, shipped, delivered
  amount: integer("amount").notNull(), // in cents
  createdAt: timestamp("created_at").defaultNow(),
});

// Database relations
export const usersRelations = relations(users, ({ many }) => ({
  quizResults: many(quizResults),
  sampleOrders: many(sampleOrders),
}));

export const quizResultsRelations = relations(quizResults, ({ one, many }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
  sampleOrders: many(sampleOrders),
}));

export const sampleOrdersRelations = relations(sampleOrders, ({ one }) => ({
  user: one(users, {
    fields: [sampleOrders.userId],
    references: [users.id],
  }),
  quizResult: one(quizResults, {
    fields: [sampleOrders.quizResultId],
    references: [quizResults.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true,
});

export const insertSampleOrderSchema = createInsertSchema(sampleOrders).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type SampleOrder = typeof sampleOrders.$inferSelect;
export type InsertSampleOrder = z.infer<typeof insertSampleOrderSchema>;
