import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import AuthShell, {
  Alert,
  Field,
  inputClass,
  linkClass,
  primaryBtn,
} from "../components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/mot-de-passe/oublie", { email });

      setMessage(
        response.data?.message ||
          "Un lien de réinitialisation a été envoyé à votre adresse email.",
      );
    } catch (err) {
      console.error("Erreur mot de passe oublié :", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Impossible d'envoyer le lien de réinitialisation.",
        );
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Mot de passe oublié ?"
      subtitle="Entrez votre adresse email pour recevoir un lien de réinitialisation."
      footer={
        <Link to="/" className={linkClass}>
          ← Retour à la connexion
        </Link>
      }
    >
      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert>{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Adresse email">
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@email.com"
            required
          />
        </Field>

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? "Envoi..." : "Envoyer le lien"}
        </button>
      </form>
    </AuthShell>
  );
}
