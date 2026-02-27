// MARK: CheckoutPage - resume el carrito y llama a /api/checkout
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import CartSummary from "../components/CartSummary";

// URL base del backend para la llamada de checkout
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function CheckoutPage() {
  // Del contexto de carrito: ítems, total y función para vaciarlo
  const { items, total, clearCart } = useCart();
  // Del contexto de auth: token de sesión para enviar al backend
  const { token } = useAuth();
  const navigate = useNavigate();
  // Estado local para feedback de usuario durante el proceso de pago
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Envía el carrito al backend para procesar la compra simulada
  const handleConfirm = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity
          }))
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al procesar la compra");
      }
      setSuccess("Compra realizada correctamente.");
      clearCart();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      mainClassName="checkout-main"
      rightSlot={
        <Link to="/" className="products-nav-link">
          Catálogo
        </Link>
      }
    >
      <h1>Checkout</h1>

      <Link to="/carrito" className="product-back-link">
        ← Volver al carrito
      </Link>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.productId} className="cart-item">
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    Q {item.price} x {item.quantity} = Q{" "}
                    {item.price * item.quantity}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <CartSummary total={total}>
            <button
              type="button"
              className="auth-button"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar pago"}
            </button>
          </CartSummary>
        </>
      )}
    </Layout>
  );
}

export default CheckoutPage;

