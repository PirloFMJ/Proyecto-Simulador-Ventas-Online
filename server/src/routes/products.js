const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();
const PRODUCTS_PATH = path.join(__dirname, "../data/products.json");

async function readProducts() {
  const data = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(data);
}

// GET /api/products — lista todos los productos (con stock actual)
router.get("/", async (req, res) => {
  try {
    const products = await readProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos."
    });
  }
});

// GET /api/products/:id — un producto por id (para detalle)
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Id de producto no válido."
      });
    }
    const products = await readProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado."
      });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("GET /api/products/:id error:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto."
    });
  }
});

module.exports = router;
