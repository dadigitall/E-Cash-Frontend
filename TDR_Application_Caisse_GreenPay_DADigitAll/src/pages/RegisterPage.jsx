import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { companyFromName } from "../theme/companies";
import AuthShell, {
  Field,
  inputClass,
  linkClass,
  primaryBtn,
} from "../components/auth/AuthShell";

// Repli si la route /postes n'est pas disponible
const POSTES_REPLI = [
  { id: 1, nom: "Assistante de direction", slug: "assistante-direction" },
  { id: 2, nom: "Commercial", slug: "commercial" },
  { id: 3, nom: "Technicien", slug: "technicien" },
  { id: 4, nom: "Comptable", slug: "comptable" },
  { id: 5, nom: "Développeur frontend", slug: "dev-frontend" },
  { id: 6, nom: "Développeur fullstack", slug: "dev-backend" },
  { id: 7, nom: "Directeur Général", slug: "directeur-général" },
  { id: 8, nom: "Autre", slug: "autre" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [entreprises, setEntreprises] = useState([]);
  const [postes, setPostes] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone_whatsapp: "",
    password: "",
    password_confirmation: "",
    entreprise_id: "",
    poste_id: "",
    poste_autre: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pour le moment (en attendant les routes API)
    setEntreprises([
      { id: 1, nom: "GreenPay" },
      { id: 2, nom: "DA Digit All" },
    ]);

    let annule = false;
    api
      .get("/postes")
      .then((res) => {
        if (annule) return;
        const liste = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? []);
        setPostes(liste.length ? liste : POSTES_REPLI);
      })
      .catch(() => {
        if (!annule) setPostes(POSTES_REPLI);
      });

    return () => {
      annule = true;
    };
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // On vide la précision quand on change de poste
  function handlePosteChange(e) {
    setForm({ ...form, poste_id: e.target.value, poste_autre: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await api.post("/register", {
        ...form,
        poste_autre: estAutre ? form.poste_autre.trim() : null,
      });
      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  }

  const posteChoisi = postes.find(
    (p) => String(p.id) === String(form.poste_id),
  );
  const estAutre = posteChoisi?.slug === "autre";

  // Le thème de la page suit l'entreprise choisie
  const choisie = entreprises.find(
    (e) => String(e.id) === String(form.entreprise_id),
  );
  const companyKey = choisie ? companyFromName(choisie.nom) : undefined;

  return (
    <AuthShell
      company={companyKey ?? undefined}
      title="Inscription"
      subtitle="Choisissez votre entreprise pour créer votre compte."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link to="/" className={linkClass}>
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Entreprise" error={errors.entreprise_id}>
          <div
            className="grid grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Entreprise"
          >
            {entreprises.map((e) => {
              const selected = String(e.id) === String(form.entreprise_id);
              return (
                <button
                  key={e.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-company={companyFromName(e.nom) ?? undefined}
                  onClick={() => setForm({ ...form, entreprise_id: e.id })}
                  className={`rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${
                    selected
                      ? "border-brand bg-brand-soft text-brand-deep"
                      : "border-line bg-surface text-ink hover:border-brand/50"
                  }`}
                >
                  {e.nom}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Nom" error={errors.name}>
          <input
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Téléphone WhatsApp" error={errors.telephone_whatsapp}>
          <input
            name="telephone_whatsapp"
            autoComplete="tel"
            value={form.telephone_whatsapp}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Poste" error={errors.poste_id}>
          <select
            name="poste_id"
            value={form.poste_id}
            onChange={handlePosteChange}
            className={inputClass}
          >
            <option value="">Choisir...</option>
            {postes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom}
              </option>
            ))}
          </select>
        </Field>

        {/* Conteneur toujours présent : évite l'erreur insertBefore */}
        <div>
          {estAutre && (
            <Field label="Précisez votre poste" error={errors.poste_autre}>
              <input
                name="poste_autre"
                maxLength={100}
                placeholder="Ex. : Chauffeur"
                value={form.poste_autre}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
          )}
        </div>

        <Field label="Mot de passe" error={errors.password}>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Confirmation">
          <input
            type="password"
            name="password_confirmation"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <button disabled={loading} className={primaryBtn}>
          {loading ? "Inscription..." : "Créer le compte"}
        </button>
      </form>
    </AuthShell>
  );
}
