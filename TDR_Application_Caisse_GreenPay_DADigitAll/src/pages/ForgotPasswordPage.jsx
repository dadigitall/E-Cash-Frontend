import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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

            const response = await api.post(
                "/mot-de-passe/oublie",
                {
                    email,
                }
            );

            setMessage(
                response.data?.message ||
                "Un lien de réinitialisation a été envoyé à votre adresse email."
            );

        } catch (err) {

            console.error(
                "Erreur mot de passe oublié :",
                err
            );

            if (err.response) {

                setError(
                    err.response.data?.message ||
                    "Impossible d'envoyer le lien de réinitialisation."
                );

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

                <h1 className="text-2xl font-bold text-center mb-3">
                    Mot de passe oublié ?
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Entrez votre adresse email pour recevoir
                    un lien de réinitialisation.
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
                            className="w-full border rounded-lg p-3"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="exemple@email.com"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 transition disabled:opacity-50"
                    >
                        {loading
                            ? "Envoi..."
                            : "Envoyer le lien"}
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