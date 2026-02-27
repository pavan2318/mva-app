require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/*
------------------------------------------------
Rate Limiting
------------------------------------------------
*/

// Per-IP limiter for login & phishing routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                  // 50 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." }
});

// IMPORTANT: Apply limiter BEFORE routes
app.use("/login", loginLimiter);
app.use("/phish", loginLimiter);

/*
------------------------------------------------
Routes
------------------------------------------------
*/

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/phish", require("./routes/phish"));
app.use("/log", require("./routes/log"));

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const { sweepExpiredSessions } = require("./services/timeoutSweeper");

setInterval(() => {
  sweepExpiredSessions().catch(console.error);
}, 60 * 1000);

/*
------------------------------------------------
Server
------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
