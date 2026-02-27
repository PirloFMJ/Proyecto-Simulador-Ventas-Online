const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const USERS_PATH = path.join(__dirname, "../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "circuit-secret-dev";

async function readUsers() {
  const data = await fs.readFile(USERS_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}

function omitPassword(user) {
  const { password, ...rest } = user;
  return rest;
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos: name, email y password son requeridos."
      });
    }

    const users = await readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese correo."
      });
    }

    const nextId = Math.max(...users.map((u) => u.id), 0) + 1;
    const newUser = {
      id: nextId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: "customer"
    };
    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({
      success: true,
      message: "Usuario registrado.",
      user: omitPassword(newUser)
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario."
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos."
      });
    }

    const users = await readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos."
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: omitPassword(user)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión."
    });
  }
});

// GET /api/auth/me — devuelve el usuario actual si el token es válido 
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = router;
