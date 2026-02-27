// MARK: ProtectedRoute - protege rutas que requieren login y/o rol admin
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  // Leemos del contexto de auth el estado de la sesión
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si la ruta requiere admin y el usuario no lo es, lo mandamos al inicio
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

