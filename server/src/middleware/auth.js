const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "circuit-secret-dev";

/**
 * Middleware que valida el JWT del header Authorization y rellena req.user.
 * Si no hay token o es inválido, responde 401 y no llama a next().
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token no enviado o formato incorrecto."
    });
  }

  const token = authHeader.slice(7); // quitar "Bearer "
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado."
    });
  }
}

module.exports = authMiddleware;
