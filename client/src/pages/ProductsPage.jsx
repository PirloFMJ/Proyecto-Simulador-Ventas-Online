import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function formatCategory(slug) {
  switch (slug) {
    case "laptops":
      return "Laptops";
    case "peripherals":
      return "Periféricos";
    case "accessories":
      return "Accesorios";
    case "audio":
      return "Audio";
    default:
      return slug;
  }
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error al cargar productos");
        }
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="products-brand">
          <span className="products-logo">⏚</span>
          <span className="products-title">Circuit</span>
        </div>
        <nav className="products-nav">
          <Link to="/login" className="products-nav-link">
            Iniciar sesión
          </Link>
          <Link to="/register" className="products-nav-link">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main className="products-main">
        <section className="products-hero">
          <h1>Catálogo de tecnología</h1>
          <p>Explora los productos disponibles en Circuit.</p>
        </section>

        <section className="products-filters">
          <label className="products-filter-label">
            Categoría
            <select
              className="products-filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Todas" : formatCategory(cat)}
                </option>
              ))}
            </select>
          </label>
        </section>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="products-error">{error}</p>}

        {!loading && !error && (
          <section className="products-grid">
            {filtered.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-category">
                  {formatCategory(product.category)}
                </div>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">Q {product.price}</span>
                  <span className="product-stock">
                    Stock: {product.stock}
                  </span>
                </div>
                <Link
                  to={`/producto/${product.id}`}
                  className="product-link"
                >
                  Ver detalle
                </Link>
              </article>
            ))}
            {filtered.length === 0 && (
              <p>No hay productos en esta categoría.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default ProductsPage;

