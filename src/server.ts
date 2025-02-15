import express, { Request, Response} from "express";
import sqlite3 from "sqlite3";

interface User {
  email: string;
  categories: number[];
}

const dbPath = process.env.NODE_ENV === 'production' 
  ? ':memory:'  // Use in-memory database for Heroku
  : 'users.db'; // Use file-based database for development

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        categories TEXT
      )
    `);
  }
});

// Properly typed database methods
const dbRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const app = express();
app.use(express.json());

// Helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

// POST /users
app.post("/users", async (req: any, res: any) => {
  try {
    const { email, categories } = req.body;

    if (!email || !categories || !Array.isArray(categories)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    await dbRun(
      "INSERT OR REPLACE INTO users (email, categories) VALUES (?, ?)",
      [email, JSON.stringify(categories)]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/:email
app.get("/users/:email", async (req: any, res: any) => {
  try {
    const { email } = req.params;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await dbGet(
      "SELECT email, categories FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      email: user.email,
      categories: JSON.parse(user.categories)
    };

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Export app for testing
export default app;