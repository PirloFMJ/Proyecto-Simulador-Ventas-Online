const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api", ordersRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Circuit API running"
  });
});

module.exports = app;
