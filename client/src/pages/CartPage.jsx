// MARK: CartPage - vista del carrito: permite revisar y ajustar cantidades
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Layout from "../components/Layout";
import CartSummary from "../components/CartSummary";

function CartPage() {
  // Leemos del contexto del carrito los ítems y operaciones sobre ellos
  const { items, updateQuantity, removeItem, total } = useCart();

  // Maneja los cambios en el input de cantidad para cada producto
  const handleQuantityChange = (productId, value) => {
    const qty = Number(value);
    if (Number.isNaN(qty) || qty < 0) return;
    updateQuantity(productId, qty);
  };

  return (
    <Layout
      mainClassName="cart-main"
      rightSlot={
        <Link to="/" className="products-nav-link">
          Catálogo
        </Link>
      }
    >
      <h1>Carrito</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link to="/" className="product-link">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
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
                <div className="cart-item-controls">
                  <input
                    type="number"
                    min="0"
                    className="cart-qty-input"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() => removeItem(item.productId)}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <CartSummary total={total}>
            <Link to="/" className="cart-secondary">
              Seguir comprando
            </Link>
            <Link to="/checkout" className="cart-primary">
              Ir a pagar
            </Link>
          </CartSummary>
        </>
      )}
    </Layout>
  );
}

export default CartPage;

