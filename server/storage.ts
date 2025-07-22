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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizResults: Map<number, QuizResult>;
  private sampleOrders: Map<number, SampleOrder>;
  private currentUserId: number;
  private currentQuizResultId: number;
  private currentSampleOrderId: number;

  constructor() {
    this.users = new Map();
    this.quizResults = new Map();
    this.sampleOrders = new Map();
    this.currentUserId = 1;
    this.currentQuizResultId = 1;
    this.currentSampleOrderId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Quiz results operations
  async saveQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentQuizResultId++;
    const result: QuizResult = {
      ...insertResult,
      id,
      createdAt: new Date()
    };
    this.quizResults.set(id, result);
    return result;
  }

  async getUserQuizResults(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values())
      .filter(result => result.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    return this.quizResults.get(id);
  }

  // Sample orders operations
  async createSampleOrder(insertOrder: InsertSampleOrder): Promise<SampleOrder> {
    const id = this.currentSampleOrderId++;
    const order: SampleOrder = {
      ...insertOrder,
      id,
      createdAt: new Date()
    };
    this.sampleOrders.set(id, order);
    return order;
  }

  async getUserSampleOrders(userId: number): Promise<SampleOrder[]> {
    return Array.from(this.sampleOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateSampleOrderStatus(id: number, status: string): Promise<void> {
    const order = this.sampleOrders.get(id);
    if (order) {
      order.status = status;
      this.sampleOrders.set(id, order);
    }
  }
}

export const storage = new MemStorage();
