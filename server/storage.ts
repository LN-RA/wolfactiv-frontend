import { 
  users, 
  quizResults, 
  sampleOrders,
  type User, 
  type InsertUser, 
  type QuizResult,
  type InsertQuizResult,
  type SampleOrder,
  type InsertSampleOrder 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quiz results operations
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getUserQuizResults(userId: number): Promise<QuizResult[]>;
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  
  // Sample orders operations
  createSampleOrder(order: InsertSampleOrder): Promise<SampleOrder>;
  getUserSampleOrders(userId: number): Promise<SampleOrder[]>;
  updateSampleOrderStatus(id: number, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Quiz results operations
  async saveQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db
      .insert(quizResults)
      .values(insertResult)
      .returning();
    return result;
  }

  async getUserQuizResults(userId: number): Promise<QuizResult[]> {
    return await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId));
  }

  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.id, id));
    return result || undefined;
  }

  // Sample orders operations
  async createSampleOrder(insertOrder: InsertSampleOrder): Promise<SampleOrder> {
    const [order] = await db
      .insert(sampleOrders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getUserSampleOrders(userId: number): Promise<SampleOrder[]> {
    return await db
      .select()
      .from(sampleOrders)
      .where(eq(sampleOrders.userId, userId));
  }

  async updateSampleOrderStatus(id: number, status: string): Promise<void> {
    await db
      .update(sampleOrders)
      .set({ status })
      .where(eq(sampleOrders.id, id));
  }
}

export const storage = new DatabaseStorage();
