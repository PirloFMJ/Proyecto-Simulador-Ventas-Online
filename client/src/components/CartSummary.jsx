// MARK: CartSummary - muestra total del carrito y permite inyectar acciones

function CartSummary({ total, children }) {
  return (
    <div className="cart-summary">
      <div className="cart-total">
        <span>Total</span>
        <span>Q {total}</span>
      </div>
      <div className="cart-actions">{children}</div>
    </div>
  );
}

export default CartSummary;

