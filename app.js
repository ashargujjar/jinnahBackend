const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoConnetct = require("./database/mongoConnect").startDb;
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow all origins
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
