// MARK: ProductsPage - catálogo de productos con filtro y botón de agregar al carrito
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";

// URL base del backend para las llamadas a la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ProductsPage() {
  // Estado local para la lista de productos, estado de carga, error y categoría activa
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");

  // Al montar el componente, cargamos los productos desde el backend
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

  // Construimos la lista de categorías a partir de los productos cargados
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  // Aplicamos el filtro de categoría seleccionado
  const filtered =
    category === "all" ? products : products.filter((p) => p.category === category);

  return (
    <Layout
      mainClassName="products-main"
      rightSlot={
        <>
          <Link to="/login" className="products-nav-link">
            Iniciar sesión
          </Link>
          <Link to="/register" className="products-nav-link">
            Crear cuenta
          </Link>
        </>
      }
    >
      <section className="products-hero">
        <h1>Catálogo de tecnología</h1>
        <p>Explora los productos disponibles en Circuit.</p>
      </section>

      <CategoryFilter
        categories={categories}
        value={category}
        onChange={setCategory}
      />

      {loading && <p>Cargando productos...</p>}
      {error && <p className="products-error">{error}</p>}

      {!loading && !error && (
        <section className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filtered.length === 0 && (
            <p>No hay productos en esta categoría.</p>
          )}
        </section>
      )}
    </Layout>
  );
}

export default ProductsPage;

