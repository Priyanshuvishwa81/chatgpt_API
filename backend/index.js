const express = require("express");

const path = require('path');
const mysql = require("mysql2");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // For rate limiting
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("DB Error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Use rate limiting to prevent abuse of login and registration routes
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 requests per window
//   message: "Too many requests from this IP, please try again later"
// });

// app.use(limiter);

// OpenAI Configuration (only for authenticated users)
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// JWT Middleware (used for token validation)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded; // Attach user info to the request object
    next();
  });
};

app.get("/verify-token", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const [existing] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password securely (Increase salt rounds for more security)
  const hashedPassword = await bcrypt.hash(password, 12);
  await db.promise().query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
    name,
    email,
    hashedPassword
  ]);

  res.json({ message: "User registered successfully" });
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
  const user = users[0];

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Create JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});




app.use(express.static(path.join(__dirname, 'frontend')));




//ai ai ai

app.post("/ask", authenticateToken, async (req, res) => {
  const { prompt } = req.body;

  try {
    const intentResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant that determines the user's intent " },
        { role: "user", content: prompt }
      ]
    });


    res.json({ response: chatResponse.choices[0].message.content });
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


