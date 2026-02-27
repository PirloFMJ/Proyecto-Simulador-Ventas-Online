// MARK: Layout - cabecera común, contenido principal y pie
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Layout({ children, mainClassName, rightSlot }) {
  const { user, loading, logout } = useAuth();
  const { items } = useCart();

  // Total de unidades en el carrito (para mostrar en el icono)
  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  const cartArea = (
    <Link to="/carrito" className="products-nav-link header-cart">
      🛒
      {totalItems > 0 && (
        <span className="header-cart-count">{totalItems}</span>
      )}
    </Link>
  );

  let authArea;
  if (loading) {
    authArea = (
      <span className="products-nav-link">Cargando sesión...</span>
    );
  } else if (user) {
    authArea = (
      <>
        <span className="products-nav-link">Hola, {user.name}</span>
        <button
          type="button"
          className="products-nav-link layout-logout-button"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </>
    );
  } else {
    authArea = (
      <>
        <Link to="/login" className="products-nav-link">
          Iniciar sesión
        </Link>
        <Link to="/register" className="products-nav-link">
          Crear cuenta
        </Link>
      </>
    );
  }

  return (
    <div className="layout-root">
      <header className="products-header">
        <div className="products-brand">
          <span className="products-logo">⏚</span>
          <Link to="/" className="products-title-link">
            <span className="products-title">Circuit</span>
          </Link>
        </div>
        <nav className="products-nav">
          {cartArea}
          {authArea}
          {rightSlot}
        </nav>
      </header>

      <main className={mainClassName}>{children}</main>

      <footer className="layout-footer">
        <span>Circuit · Sistema de ventas de tecnología</span>
      </footer>
    </div>
  );
}

export default Layout;

