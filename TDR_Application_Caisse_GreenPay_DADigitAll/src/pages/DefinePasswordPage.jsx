import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";
import AuthShell, {
  Alert,
  Field,
  inputClass,
  linkClass,
  primaryBtn,
} from "../components/auth/AuthShell";

export default function DefinePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // activation par défaut si aucun mode n'est fourni
  const mode = searchParams.get("mode") || "activation";
  const isReset = mode === "reset";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token || !email) {
      setError("Le lien de définition du mot de passe est invalide.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/mot-de-passe/reinitialiser", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(
        response.data?.message ||
          (isReset
            ? "Votre mot de passe a été réinitialisé avec succès."
            : "Votre mot de passe a été défini avec succès."),
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Erreur définition mot de passe :", err);

      if (err.response) {
        const errors = err.response.data?.errors;

        if (errors) {
          const firstError = Object.values(errors).flat()[0];
          setError(firstError || "Impossible de définir le mot de passe.");
        } else {
          setError(err.response.data?.message || "Token invalide ou expiré.");
        }
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={isReset ? "Nouveau mot de passe" : "Bienvenue"}
      subtitle={
        isReset
          ? "Définissez un nouveau mot de passe pour sécuriser votre compte E-Cash."
          : "Définissez votre mot de passe pour activer votre compte E-Cash."
      }
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
            value={email || ""}
            disabled
            className={inputClass}
          />
        </Field>

        <Field label="Nouveau mot de passe">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
            minLength={6}
          />
        </Field>

        <Field label="Confirmer le mot de passe">
          <input
            type="password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className={inputClass}
            required
            minLength={6}
          />
        </Field>

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading
            ? "Enregistrement..."
            : isReset
              ? "Réinitialiser mon mot de passe"
              : "Définir mon mot de passe"}
        </button>
      </form>
    </AuthShell>
  );
}
