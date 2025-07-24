import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertQuizResultSchema,
  insertSampleOrderSchema
} from "@shared/schema";
import { z } from "zod";

// --- Initialisation Stripe sécurisée ---
let stripe: Stripe | null = null;

if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "disable"
) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15", // ✅ version stable et recommandée
  });
} else {
  console.log("💳 Stripe désactivé : clé absente ou désactivée.");
}

// --- Schémas Zod ---
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = insertUserSchema;

// --- Fonction d'enregistrement des routes ---
export async function registerRoutes(app: Express): Promise<Server> {

  // --- Authentification ---
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // --- Quiz results ---
  app.post("/api/quiz-results", async (req, res) => {
    try {
      const resultData = insertQuizResultSchema.parse(req.body);
      const result = await storage.saveQuizResult(resultData);
      res.json(result);
    } catch {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/quiz-results/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const results = await storage.getUserQuizResults(userId);
      res.json(results);
    } catch {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // --- Paiement Stripe (si actif) ---
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;

        if (!amount || amount < 50) {
          return res.status(400).json({ message: "Invalid amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount),
          currency: "eur",
          metadata: {
            product: "wolfactiv_sample_set",
          },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({
          message: "Error creating payment intent: " + error.message,
        });
      }
    });
  } else {
    console.log("🚫 Stripe désactivé : /api/create-payment-intent non disponible");
  }

  // --- Commandes de kits ---
  app.post("/api/sample-orders", async (req, res) => {
    try {
      const orderData = insertSampleOrderSchema.parse(req.body);
      const order = await storage.createSampleOrder(orderData);
      res.json(order);
    } catch {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/sample-orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserSampleOrders(userId);
      res.json(orders);
    } catch {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // --- Création du serveur HTTP ---
  const httpServer = createServer(app);
  return httpServer;
}
