import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, FileText, X } from "lucide-react";

import api from "../../../services/api";
import { ghostBtnClass, primaryBtnClass } from "../../ui/styles";

/*
  preuve  : l'objet preuve (avec id) ou null
  onClose : fermer la fenêtre
  onValidate(id) / onReject(id) : optionnels
*/
export default function ProofViewerModal({
  preuve,
  onClose,
  onValidate,
  onReject,
}) {
  const [url, setUrl] = useState(null);
  const [type, setType] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);

  const id = preuve?.id;

  // Charge le fichier via l'API avec le token (pas de lien public nécessaire)
  useEffect(() => {
    if (!id) return;

    let annule = false;
    let objectUrl = null;

    setUrl(null);
    setType("");
    setErreur("");
    setLoading(true);

    api
      .get(`/preuves/${id}/fichier`, { responseType: "blob" })
      .then((res) => {
        if (annule) return;
        objectUrl = URL.createObjectURL(res.data);
        setType(res.data.type || "");
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!annule) setErreur("Impossible de charger la preuve.");
      })
      .finally(() => {
        if (!annule) setLoading(false);
      });

    return () => {
      annule = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  // Verrouille le défilement de la page et ferme avec Échap
  useEffect(() => {
    if (!id) return;

    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = precedent;
      document.removeEventListener("keydown", onKey);
    };
  }, [id, onClose]);

  if (!preuve) return null;

  async function agir(fn) {
    setAction(true);
    try {
      await fn?.(preuve.id);
      onClose();
    } finally {
      setAction(false);
    }
  }

  const estImage = type.startsWith("image/");
  const estPdf = type === "application/pdf";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-title"
      translate="no"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface text-ink shadow-2xl"
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
              <FileText size={22} />
            </span>
            <div>
              <h2
                id="proof-title"
                className="text-xl font-semibold tracking-tight"
              >
                Preuve de dépense
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                Vérifiez la pièce avant de valider.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-brand-soft hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="min-h-[200px] flex-1 overflow-y-auto bg-canvas p-4 sm:p-6">
          {loading && (
            <p className="py-16 text-center text-muted">Chargement…</p>
          )}

          {erreur && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {erreur}
            </div>
          )}

          {url && estImage && (
            <img
              src={url}
              alt="Preuve de dépense"
              className="mx-auto max-h-[60dvh] w-auto max-w-full rounded-xl object-contain"
            />
          )}

          {url && estPdf && (
            <iframe
              src={url}
              title="Preuve de dépense"
              className="h-[60dvh] w-full rounded-xl border border-line"
            />
          )}

          {url && !estImage && !estPdf && (
            <a href={url} download className={primaryBtnClass}>
              Télécharger le fichier
            </a>
          )}
        </div>

        {/* Pied : actions */}
        {(onValidate || onReject) && (
          <div className="flex flex-col-reverse gap-3 border-t border-line bg-surface px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            {onReject && (
              <button
                type="button"
                disabled={action}
                onClick={() => agir(onReject)}
                className={ghostBtnClass}
              >
                Rejeter
              </button>
            )}
            {onValidate && (
              <button
                type="button"
                disabled={action}
                onClick={() => agir(onValidate)}
                className={`${primaryBtnClass} inline-flex items-center justify-center gap-2`}
              >
                <Check size={18} />
                Valider
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
