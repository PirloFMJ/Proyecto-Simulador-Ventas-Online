// MARK: RegisterPage - formulario de registro y llamada a /api/auth/register
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  // Obtenemos la función register del contexto de autenticación
  const { register } = useAuth();
  const navigate = useNavigate();
  // Estado local para los campos del formulario y feedback al usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Envía los datos al backend para crear un nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register({ name, email, password });
      setSuccess("Usuario creado. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Circuit</h1>
        <h2 className="auth-subtitle">Crear cuenta</h2>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Nombre completo
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Correo electrónico
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Contraseña
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

