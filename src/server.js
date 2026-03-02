require("dotenv").config();
const express = require("express");
const path = require("path");
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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." }
});

// Apply limiter BEFORE routes
app.use("/login", loginLimiter);
app.use("/phish", loginLimiter);

/*
------------------------------------------------
API Routes
------------------------------------------------
*/

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/phish", require("./routes/phish"));
app.use("/log", require("./routes/log"));

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

/*
------------------------------------------------
Timeout Sweeper
------------------------------------------------
*/

const { sweepExpiredSessions } = require("./services/timeoutSweeper");

setInterval(() => {
  sweepExpiredSessions().catch(console.error);
}, 60 * 1000);

/*
------------------------------------------------
Serve Frontend (React Build)
------------------------------------------------
*/

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

/*
------------------------------------------------
Server
------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
