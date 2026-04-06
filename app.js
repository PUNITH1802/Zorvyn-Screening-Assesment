const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const userRoutes = require("./src/routes/userRoutes");
const financeRoutes = require("./src/routes/financeRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

// ── Global middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Basic rate limiting (100 req / 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── Routes ────────────────────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({ success: true, message: "Finance Data Processing API is running." });
});

app.use("/api/users", userRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ── Error handling ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
