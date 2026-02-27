// MARK: ProductDetailPage - detalle de un producto individual
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// URL base del backend para las llamadas a la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Traduce el slug de categoría a un texto legible
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

function ProductDetailPage() {
  // Leemos el id de producto desde la URL (/producto/:id)
  const { id } = useParams();
  // Estado local para el producto, la carga y posibles errores
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cada vez que cambie el id, pedimos al backend el detalle de ese producto
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error al cargar el producto");
        }
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="product-detail-page">
      <header className="products-header">
        <div className="products-brand">
          <span className="products-logo">⏚</span>
          <Link to="/" className="products-title-link">
            <span className="products-title">Circuit</span>
          </Link>
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

      <main className="product-detail-main">
        <Link to="/" className="product-back-link">
          ← Volver al catálogo
        </Link>

        {loading && <p>Cargando producto...</p>}
        {error && <p className="products-error">{error}</p>}

        {!loading && !error && product && (
          <article className="product-detail-card">
            <div className="product-detail-header">
              <span className="product-category">
                {formatCategory(product.category)}
              </span>
              <h1 className="product-detail-name">{product.name}</h1>
            </div>
            <p className="product-detail-description">
              {product.description}
            </p>
            <div className="product-detail-meta">
              <div>
                <span className="product-detail-label">Precio</span>
                <span className="product-detail-value">
                  Q {product.price}
                </span>
              </div>
              <div>
                <span className="product-detail-label">Stock disponible</span>
                <span className="product-detail-value">
                  {product.stock}
                </span>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default ProductDetailPage;

