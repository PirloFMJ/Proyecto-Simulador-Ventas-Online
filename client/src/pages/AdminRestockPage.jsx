// MARK: AdminRestockPage - panel para aumentar stock (solo para rol admin)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

// URL base del backend para las llamadas de administración
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AdminRestockPage() {
  // Desde el contexto de auth leemos el token y los datos del usuario (para mostrar el nombre)
  const { token, user } = useAuth();
  // Estado local: lista de productos, producto seleccionado y cantidad de restock
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Al montar la página, cargamos todos los productos para mostrar su stock actual
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error al cargar productos");
        }
        setProducts(data);
        if (data.length > 0) {
          setSelectedId(String(data[0].id));
        }
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: Number(selectedId),
          quantity: Number(quantity)
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al actualizar stock");
      }
      setSuccess("Stock actualizado correctamente.");
      setProducts((prev) =>
        prev.map((p) => (p.id === data.product.id ? data.product : p))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      mainClassName="admin-main"
      rightSlot={
        <span className="products-nav-link">
          Admin: {user?.name || "Desconocido"}
        </span>
      }
    >
      <h1>Restock de productos</h1>
      <p className="admin-subtitle">
        Aumenta el stock de un producto existente.
      </p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <label className="admin-label">
          Producto
          <select
            className="admin-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock actual: {p.stock})
              </option>
            ))}
          </select>
        </label>

        <label className="admin-label">
          Cantidad a agregar
          <input
            type="number"
            min="1"
            className="admin-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar stock"}
        </button>
      </form>
    </Layout>
  );
}

export default AdminRestockPage;

