const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoConnetct = require("./database/mongoConnect").startDb;
const userRoutes = require("./routes/userRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/user", userRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
MongoConnetct(() => {
  console.log("Server is running on port 3000");
  app.listen(3000, "0.0.0.0", () => console.log("Server running on network"));
});
