// MARK: ProductCard - tarjeta reutilizable para un producto en el catálogo
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

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

function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <div className="product-category">
        {formatCategory(product.category)}
      </div>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-description">{product.description}</p>
      <div className="product-meta">
        <span className="product-price">Q {product.price}</span>
        <span className="product-stock">Stock: {product.stock}</span>
      </div>
      <div className="product-actions">
        <button
          type="button"
          className="product-add-button"
          onClick={() => addItem(product, 1)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
        <Link to={`/producto/${product.id}`} className="product-link">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;

