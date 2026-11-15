import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthShell, {
  Alert,
  Field,
  inputClass,
  linkClass,
  primaryBtn,
} from "../components/auth/AuthShell";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { email, password });

      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Identifiants incorrects.");
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Connexion"
      subtitle="Accédez à la caisse de votre entreprise."
      footer={
        <Link to="/mot-de-passe/oublie" className={linkClass}>
          Mot de passe oublié ?
        </Link>
      }
    >
      {error && <Alert>{error}</Alert>}

      <form onSubmit={handleLogin} className="space-y-5">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field label="Mot de passe">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`${inputClass} pr-12`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </AuthShell>
  );
}
