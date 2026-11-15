import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import api from "../../../services/api";
import {
  ghostBtnClass,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "../../ui/styles";

const FORM_VIDE = { nom: "", entreprise_id: "", solde: "0" };

export default function AddCaisseModal({ isOpen, onClose, onSuccess }) {
  const [entreprises, setEntreprises] = useState([]);
  const [form, setForm] = useState(FORM_VIDE);

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

      const data = Array.isArray(response.data)
        ? response.data
        : (response.data?.data ?? []);

      setEntreprises(data);
    } catch (err) {
      console.error("Erreur chargement entreprises :", err);

      setError(
        err.response?.data?.message || "Impossible de charger les entreprises.",
      );
    } finally {
      setLoadingEntreprises(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
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

      setSuccess("La caisse a été créée avec succès.");
      setForm(FORM_VIDE);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      console.error("Erreur création caisse :", err);

      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;

        if (errors) {
          const firstError = Object.values(errors).flat()[0];
          setError(firstError || "Les informations saisies sont invalides.");
        } else {
          setError(
            err.response.data?.message ||
              "Les informations saisies sont invalides.",
          );
        }
      } else {
        setError(
          err.response?.data?.message || "Impossible de créer la caisse.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setError("");
    setSuccess("");
    setForm(FORM_VIDE);
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-caisse-title"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-lg rounded-3xl bg-surface p-6 text-ink shadow-2xl"
      >
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="add-caisse-title" className="text-xl font-semibold">
              Ajouter une caisse
            </h2>
            <p className="mt-1 text-sm text-muted">
              Créez une nouvelle caisse pour une entreprise.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fermer"
            className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-brand-soft hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {success}
          </div>
        )}

        {loadingEntreprises ? (
          <div className="py-10 text-center text-muted">
            Chargement des entreprises...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Nom de la caisse</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Ex : Caisse principale"
              />
            </div>

            <div>
              <label className={labelClass}>Entreprise</label>
              <select
                name="entreprise_id"
                value={form.entreprise_id}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Sélectionner une entreprise</option>
                {entreprises.map((entreprise) => (
                  <option key={entreprise.id} value={entreprise.id}>
                    {entreprise.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Solde initial</label>
              <input
                type="number"
                name="solde"
                value={form.solde}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted">
                Vous pouvez laisser 0 si la caisse sera approvisionnée plus
                tard.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={ghostBtnClass}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={loading || loadingEntreprises}
                className={primaryBtnClass}
              >
                {loading ? "Création..." : "Créer la caisse"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
