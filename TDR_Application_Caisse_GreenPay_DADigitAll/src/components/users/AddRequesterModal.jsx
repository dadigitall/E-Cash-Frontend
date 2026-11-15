import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail, UserPlus, X } from "lucide-react";

import api from "../../services/api";
import { CompanyLogo } from "../ui/DashboardKit";
import PosteSelect from "../ui/PosteSelect";
import { Field, inputClass } from "../auth/AuthShell";
import { ghostBtnClass, primaryBtnClass } from "../ui/styles";
import { companyFromName } from "../../theme/companies";

const CREATE_USER_ENDPOINT = "/users";
const POSTES_ENDPOINT = "/postes";

const ENTREPRISES_PAR_DEFAUT = [
  { id: 1, nom: "GreenPay" },
  { id: 2, nom: "DA Digit All" },
];

// Repli si /postes échoue (ids et slugs identiques à la base)
const POSTES_PAR_DEFAUT = [
  { id: 1, nom: "Assistante de direction", slug: "assistante-direction" },
  { id: 2, nom: "Commercial", slug: "commercial" },
  { id: 4, nom: "Comptable", slug: "comptable" },
  { id: 7, nom: "Directeur Général", slug: "directeur-général" },
  { id: 5, nom: "Développeur frontend", slug: "dev-frontend" },
  { id: 6, nom: "Développeur fullstack", slug: "dev-backend" },
  { id: 3, nom: "Technicien", slug: "technicien" },
  { id: 8, nom: "Autre", slug: "autre" },
];

const INDICATIFS = [
  { code: "229", pays: "BJ" },
  { code: "228", pays: "TG" },
  { code: "225", pays: "CI" },
  { code: "221", pays: "SN" },
  { code: "226", pays: "BF" },
  { code: "227", pays: "NE" },
  { code: "223", pays: "ML" },
  { code: "234", pays: "NG" },
  { code: "33", pays: "FR" },
];

const FORM_VIDE = {
  name: "",
  email: "",
  indicatif: "229",
  telephone: "",
  entreprise_id: "",
  poste_id: "",
  poste_autre: "",
};

const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

export default function AddRequesterModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(FORM_VIDE);
  const [errors, setErrors] = useState({});
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [cree, setCree] = useState(null);

  const [entreprises, setEntreprises] = useState(ENTREPRISES_PAR_DEFAUT);
  const [postes, setPostes] = useState(POSTES_PAR_DEFAUT);

  // Réinitialisation et chargement des listes à chaque ouverture
  useEffect(() => {
    if (!isOpen) return;

    setForm(FORM_VIDE);
    setErrors({});
    setErreur("");
    setCree(null);

    let annule = false;

    (async () => {
      const [ent, pos] = await Promise.allSettled([
        api.get("/entreprises"),
        api.get(POSTES_ENDPOINT),
      ]);
      if (annule) return;

      if (ent.status === "fulfilled") {
        const liste = toList(ent.value.data);
        if (liste.length) setEntreprises(liste);
      }
      if (pos.status === "fulfilled") {
        const liste = toList(pos.value.data);
        if (liste.length) setPostes(liste);
      }
    })();

    return () => {
      annule = true;
    };
  }, [isOpen]);

  // Verrouille le défilement de la page et ferme avec Échap
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  function setChamp(nom, valeur) {
    setForm((f) => ({ ...f, [nom]: valeur }));
    setErrors((er) => ({ ...er, [nom]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    const chiffres = form.telephone.replace(/\D/g, "");
    const posteChoisi = postes.find(
      (p) => String(p.id) === String(form.poste_id),
    );
    const estAutre = posteChoisi?.slug === "autre";
    const nouvelles = {};

    if (!form.name.trim()) nouvelles.name = "Indiquez le nom complet.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      nouvelles.email = "Adresse email invalide.";
    if (chiffres.length < 8)
      nouvelles.telephone_whatsapp = "Numéro WhatsApp invalide.";
    if (!form.entreprise_id)
      nouvelles.entreprise_id = "Choisissez une entreprise.";
    if (!form.poste_id) nouvelles.poste_id = "Choisissez un poste.";
    if (estAutre && !form.poste_autre.trim())
      nouvelles.poste_autre = "Précisez le poste.";

    setErrors(nouvelles);
    if (Object.keys(nouvelles).length > 0) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      telephone_whatsapp: `+${form.indicatif}${chiffres}`,
      entreprise_id: form.entreprise_id,
      poste_id: form.poste_id,
      // Le rôle n'est jamais envoyé : le serveur le déduit du poste
      ...(estAutre ? { poste_autre: form.poste_autre.trim() } : {}),
    };

    setLoading(true);
    try {
      await api.post(CREATE_USER_ENDPOINT, payload);
      setCree({ nom: payload.name, email: payload.email });
      onSuccess?.();
    } catch (err) {
      console.error("Erreur création utilisateur :", err);

      if (err.response?.status === 422 && err.response.data?.errors) {
        setErrors(err.response.data.errors);
        setErreur("Certaines informations sont invalides.");
      } else {
        setErreur(
          err.response?.data?.message || "Impossible de créer l'utilisateur.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  // Les erreurs Laravel sont des tableaux : on prend le premier message
  const msg = (v) => (Array.isArray(v) ? v[0] : v);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
      translate="no"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-surface text-ink shadow-2xl"
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
              <UserPlus size={22} />
            </span>
            <div>
              <h2
                id="add-user-title"
                className="text-xl font-semibold tracking-tight"
              >
                Ajouter un utilisateur
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                Un email sera envoyé afin que l'employé définisse son mot de
                passe.
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

        {cree ? (
          /* ---------- Succès ---------- */
          <div className="flex flex-col items-center px-4 py-10 text-center sm:px-6">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"
            >
              <Check size={32} strokeWidth={3} />
            </motion.span>

            <h3 className="mt-5 text-lg font-semibold">Utilisateur créé</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {`${cree.nom} va recevoir un email à ${cree.email} pour définir son mot de passe.`}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                className={ghostBtnClass}
                onClick={() => {
                  setForm(FORM_VIDE);
                  setCree(null);
                }}
              >
                Ajouter un autre
              </button>
              <button
                type="button"
                className={primaryBtnClass}
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          /* ---------- Formulaire ---------- */
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
              {erreur && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {erreur}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" error={msg(errors.name)}>
                  <input
                    value={form.name}
                    onChange={(e) => setChamp("name", e.target.value)}
                    placeholder="Ex : Jean Dupont"
                    autoComplete="off"
                    className={inputClass}
                  />
                </Field>

                <Field label="Email" error={msg(errors.email)}>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setChamp("email", e.target.value)}
                      placeholder="jean@example.com"
                      autoComplete="off"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>
              </div>

              <Field
                label="Téléphone WhatsApp"
                error={msg(errors.telephone_whatsapp)}
              >
                <div className="flex rounded-xl border border-line bg-surface transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15">
                  <select
                    aria-label="Indicatif du pays"
                    value={form.indicatif}
                    onChange={(e) => setChamp("indicatif", e.target.value)}
                    className="rounded-l-xl border-r border-line bg-canvas py-3 pl-3 pr-2 text-sm font-medium text-ink outline-none"
                  >
                    {INDICATIFS.map((i) => (
                      <option key={i.code} value={i.code}>
                        {`${i.pays} +${i.code}`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.telephone}
                    onChange={(e) => setChamp("telephone", e.target.value)}
                    placeholder="01 97 00 00 00"
                    className="min-w-0 flex-1 rounded-r-xl bg-transparent px-4 py-3 text-ink outline-none placeholder:text-muted/60"
                  />
                </div>
              </Field>

              <Field label="Entreprise" error={msg(errors.entreprise_id)}>
                <div
                  role="radiogroup"
                  aria-label="Entreprise"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {entreprises.map((ent) => {
                    const key = companyFromName(ent.nom);
                    const selected =
                      String(ent.id) === String(form.entreprise_id);

                    return (
                      <button
                        key={ent.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        data-company={key ?? undefined}
                        onClick={() => setChamp("entreprise_id", ent.id)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                          selected
                            ? "border-brand bg-brand-soft"
                            : "border-line bg-surface hover:border-brand/40"
                        }`}
                      >
                        {key ? (
                          <CompanyLogo companyKey={key} size={40} />
                        ) : (
                          <span className="size-10 rounded-xl bg-brand-soft" />
                        )}
                        <span className="font-semibold text-ink">
                          {ent.nom}
                        </span>
                        {selected && (
                          <Check size={18} className="ml-auto text-brand" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <PosteSelect
                postes={postes}
                posteId={form.poste_id}
                posteAutre={form.poste_autre}
                onChange={(valeurs) => {
                  setForm((f) => ({ ...f, ...valeurs }));
                  setErrors((er) => ({
                    ...er,
                    poste_id: undefined,
                    poste_autre: undefined,
                  }));
                }}
                error={msg(errors.poste_id)}
                errorAutre={msg(errors.poste_autre)}
              />
            </div>

            {/* Pied : toujours visible */}
            <div className="flex flex-col-reverse gap-3 border-t border-line bg-surface px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button type="button" onClick={onClose} className={ghostBtnClass}>
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={primaryBtnClass}
              >
                {loading ? "Création..." : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
