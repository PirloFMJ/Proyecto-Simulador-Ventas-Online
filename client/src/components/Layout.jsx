// MARK: Layout - cabecera común, contenido principal y pie
import { Link } from "react-router-dom";

function Layout({ children, mainClassName, rightSlot }) {
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

