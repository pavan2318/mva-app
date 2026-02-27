require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/phish", require("./routes/phish"));
app.use("/log", require("./routes/log"));
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
