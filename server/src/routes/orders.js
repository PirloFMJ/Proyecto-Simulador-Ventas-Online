const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const authMiddleware = require("../middleware/auth");
const { sendOrderEmail } = require("../services/emailService");

const router = express.Router();

const PRODUCTS_PATH = path.join(__dirname, "../data/products.json");

async function readProducts() {
  const data = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeProducts(products) {
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
}

// POST /api/checkout
// Body esperado: { items: [{ productId, quantity }] }
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El carrito (items) es requerido y no puede estar vacío."
      });
    }

    const products = await readProducts();

    // Verificar stock suficiente
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Producto con id ${item.productId} no existe.`
        });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Cantidad inválida para el producto ${product.name}.`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `No hay stock suficiente para ${product.name}.`
        });
      }
    }

    // Restar stock y calcular total
    let total = 0;
    const detailedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      product.stock -= item.quantity;
      const lineTotal = product.price * item.quantity;
      total += lineTotal;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        lineTotal
      };
    });

    await writeProducts(products);

    // Enviar correo al admin (si SMTP está configurado)
    try {
      await sendOrderEmail({
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Enviar al administrador
        customerEmail: req.user.email, // Correo del cliente que hizo el pedido
        items: detailedItems,
        total
      });
    } catch (err) {
      console.warn("No se pudo enviar el correo de orden:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Compra realizada correctamente.",
      total,
      items: detailedItems
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({
      success: false,
      message: "Error al procesar el checkout."
    });
  }
});

// POST /api/admin/restock
// Solo admin. Body esperado: { productId, quantity }
router.post("/admin/restock", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Solo un administrador puede hacer restock."
      });
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "productId y quantity (>0) son requeridos."
      });
    }

    const products = await readProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${productId} no existe.`
      });
    }

    product.stock += quantity;
    await writeProducts(products);

    res.status(200).json({
      success: true,
      message: "Stock actualizado.",
      product
    });
  } catch (err) {
    console.error("Restock error:", err);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el stock."
    });
  }
});

module.exports = router;

