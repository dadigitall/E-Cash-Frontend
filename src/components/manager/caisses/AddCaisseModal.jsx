import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AddCaisseModal({
    isOpen,
    onClose,
    onSuccess,
}) {
    const [entreprises, setEntreprises] = useState([]);

    const [form, setForm] = useState({
        nom: "",
        entreprise_id: "",
        solde: "0",
    });

    const [loading, setLoading] = useState(false);
    const [loadingEntreprises, setLoadingEntreprises] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        fetchEntreprises();
    }, [isOpen]);

    async function fetchEntreprises() {
        setLoadingEntreprises(true);
        setError("");

        try {
            const response = await api.get("/entreprises");

            console.log("Réponse /entreprises :", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];

            console.log("Entreprises utilisées :", data);

            setEntreprises(data);

        } catch (err) {
            console.error(
                "Erreur chargement entreprises :",
                err
            );

            setError(
                err.response?.data?.message ||
                "Impossible de charger les entreprises."
            );

        } finally {
            setLoadingEntreprises(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await api.post("/caisses", {
                nom: form.nom,
                entreprise_id: form.entreprise_id,
                solde: Number(form.solde),
            });

            setSuccess(
                "La caisse a été créée avec succès."
            );

            setForm({
                nom: "",
                entreprise_id: "",
                solde: "0",
            });

            if (onSuccess) {
                await onSuccess();
            }

        } catch (err) {
            console.error(
                "Erreur création caisse :",
                err
            );

            if (err.response?.status === 422) {
                const errors =
                    err.response.data?.errors;

                if (errors) {
                    const firstError =
                        Object.values(errors)
                            .flat()[0];

                    setError(
                        firstError ||
                        "Les informations saisies sont invalides."
                    );
                } else {
                    setError(
                        err.response.data?.message ||
                        "Les informations saisies sont invalides."
                    );
                }
            } else {
                setError(
                    err.response?.data?.message ||
                    "Impossible de créer la caisse."
                );
            }

        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setError("");
        setSuccess("");

        setForm({
            nom: "",
            entreprise_id: "",
            solde: "0",
        });

        onClose();
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-xl font-semibold">
                            Ajouter une caisse
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Créez une nouvelle caisse pour une entreprise.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>

                </div>

                {/* ERREUR */}

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                {/* SUCCÈS */}

                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
                        {success}
                    </div>
                )}

                {loadingEntreprises ? (

                    <div className="py-10 text-center text-gray-500">
                        Chargement des entreprises...
                    </div>

                ) : (

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* NOM */}

                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Nom de la caisse
                            </label>

                            <input
                                type="text"
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3"
                                placeholder="Ex : Caisse principale"
                            />

                        </div>

                        {/* ENTREPRISE */}

                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Entreprise
                            </label>

                            <select
                                name="entreprise_id"
                                value={form.entreprise_id}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 bg-white"
                            >

                                <option value="">
                                    Sélectionner une entreprise
                                </option>

                                {entreprises.map((entreprise) => (
                                    <option
                                        key={entreprise.id}
                                        value={entreprise.id}
                                    >
                                        {entreprise.nom}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* SOLDE INITIAL */}

                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Solde initial
                            </label>

                            <input
                                type="number"
                                name="solde"
                                value={form.solde}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full border rounded-lg p-3"
                            />

                            <p className="text-xs text-gray-500 mt-1">
                                Vous pouvez laisser 0 si la caisse
                                sera approvisionnée plus tard.
                            </p>

                        </div>

                        {/* BOUTONS */}

                        <div className="flex justify-end gap-3 pt-4">

                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    loadingEntreprises
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Création..."
                                    : "Créer la caisse"}
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}