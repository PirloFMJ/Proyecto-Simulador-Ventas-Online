import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminRestockPage from "./pages/AdminRestockPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restock"
            element={
              <ProtectedRoute requireAdmin>
                <AdminRestockPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

