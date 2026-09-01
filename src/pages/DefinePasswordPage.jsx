import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

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

            setError(
                "Le lien de définition du mot de passe est invalide."
            );

            return;
        }

        if (password !== passwordConfirmation) {

            setError(
                "Les deux mots de passe ne correspondent pas."
            );

            return;
        }

        if (password.length < 6) {

            setError(
                "Le mot de passe doit contenir au moins 6 caractères."
            );

            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/mot-de-passe/reinitialiser",
                {
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }
            );

            setMessage(
                response.data?.message ||
                (
                    isReset
                        ? "Votre mot de passe a été réinitialisé avec succès."
                        : "Votre mot de passe a été défini avec succès."
                )
            );

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {

            console.error(
                "Erreur définition mot de passe :",
                err
            );

            if (err.response) {

                const errors =
                    err.response.data?.errors;

                if (errors) {

                    const firstError =
                        Object.values(errors)
                            .flat()[0];

                    setError(
                        firstError ||
                        "Impossible de définir le mot de passe."
                    );

                } else {

                    setError(
                        err.response.data?.message ||
                        "Token invalide ou expiré."
                    );

                }

            } else {

                setError(
                    "Impossible de contacter le serveur."
                );

            }

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">

                {/* TITRE DYNAMIQUE */}
                <h1 className="text-2xl font-bold text-center mb-2">
                    {isReset
                        ? "Réinitialiser votre mot de passe"
                        : "Bienvenue"
                    }
                </h1>

                {/* DESCRIPTION DYNAMIQUE */}
                <p className="text-center text-gray-500 mb-8">

                    {isReset
                        ? "Définissez un nouveau mot de passe pour sécuriser votre compte E-kash."
                        : "Définissez votre mot de passe pour activer votre compte E-kash."
                    }

                </p>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-5">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-5">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2">
                            Adresse email
                        </label>

                        <input
                            type="email"
                            value={email || ""}
                            disabled
                            className="w-full border rounded-lg p-3 bg-gray-100"
                        />

                    </div>

                    <div>

                        <label className="block mb-2">
                            Nouveau mot de passe
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                            required
                            minLength={6}
                        />

                    </div>

                    <div>

                        <label className="block mb-2">
                            Confirmer le mot de passe
                        </label>

                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                            required
                            minLength={6}
                        />

                    </div>

                    {/* BOUTON DYNAMIQUE */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 transition disabled:opacity-50"
                    >
                        {loading
                            ? "Enregistrement..."
                            : isReset
                                ? "Réinitialiser mon mot de passe"
                                : "Définir mon mot de passe"
                        }
                    </button>

                </form>

                <p className="text-center mt-6">

                    <Link
                        to="/"
                        className="text-green-600 hover:text-green-700"
                    >
                        ← Retour à la connexion
                    </Link>

                </p>

            </div>

        </div>

    );
}