import { useEffect, useState } from "react";
import api from "../../services/api";
import TelephoneField from "./TelephoneField";

export default function AddRequesterModal({ isOpen, onClose, onSuccess }) {
  const [postes, setPostes] = useState([]);
  const [entreprises, setEntreprises] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone_whatsapp: "",
    poste_id: "",
    entreprise_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // CHARGEMENT POSTES + ENTREPRISES
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    fetchFormData();
  }, [isOpen]);

  async function fetchFormData() {
    setLoadingData(true);
    setError("");

    try {
      const [postesResponse, entreprisesResponse] = await Promise.all([
        api.get("/postes"),
        api.get("/entreprises"),
      ]);

      // -------------------------
      // POSTES
      // -------------------------

      const postesData = Array.isArray(postesResponse.data)
        ? postesResponse.data
        : (postesResponse.data?.data ?? []);

      setPostes(postesData);

      // -------------------------
      // ENTREPRISES
      // -------------------------

      const entreprisesData = Array.isArray(entreprisesResponse.data)
        ? entreprisesResponse.data
        : (entreprisesResponse.data?.data ?? []);

      setEntreprises(entreprisesData);

      console.log("Postes disponibles :", postesData);
      console.log("Entreprises :", entreprisesData);
    } catch (err) {
      console.error("Erreur chargement formulaire demandeur :", err);

      console.error("Réponse serveur :", err.response?.data);

      setError("Impossible de charger les postes et les entreprises.");
    } finally {
      setLoadingData(false);
    }
  }

  // =====================================================
  // CHANGEMENT DES CHAMPS
  // =====================================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =====================================================
  // CREATION
  // =====================================================

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/users", {
        name: form.name,
        email: form.email,
        telephone_whatsapp: form.telephone_whatsapp,
        poste_id: form.poste_id,
        entreprise_id: form.entreprise_id,
      });

      setSuccess(
        "L'utilisateur a été créé. Un email lui a été envoyé pour définir son mot de passe.",
      );

      setForm({
        name: "",
        email: "",
        telephone_whatsapp: "",
        poste_id: "",
        entreprise_id: "",
      });

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      console.error("Erreur création utilisateur :", err);

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
          err.response?.data?.message || "Impossible de créer le demandeur.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FERMETURE
  // =====================================================

  function handleClose() {
    setError("");
    setSuccess("");

    setForm({
      name: "",
      email: "",
      telephone_whatsapp: "",
      poste_id: "",
      entreprise_id: "",
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
            {/* <h2 className="text-xl font-semibold">
                            Ajouter un demandeur
                        </h2> */}

            <p className="text-sm text-gray-500 mt-1">
              Un email sera envoyé afin que l'employé définisse son mot de
              passe.
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

        {/* CHARGEMENT */}

        {loadingData ? (
          <div className="py-10 text-center text-gray-500">
            Chargement des informations...
          </div>
        ) : (
          <>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NOM */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom complet
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                  placeholder="Ex : Jean Dupont"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                  placeholder="jean@example.com"
                />
              </div>

              {/* TELEPHONE */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Téléphone WhatsApp
                </label>

                <TelephoneField value={telephone} onChange={setTelephone} />
              </div>

              {/* POSTE */}

              <div>
                <label className="block text-sm font-medium mb-1">Poste</label>

                <select
                  name="poste_id"
                  value={form.poste_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 bg-white"
                >
                  <option value="">Sélectionner un poste</option>

                  {postes.map((poste) => (
                    <option key={poste.id} value={poste.id}>
                      {poste.nom}
                    </option>
                  ))}
                </select>

                {postes.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Aucun poste utilisateur disponible.
                  </p>
                )}
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
                  <option value="">Sélectionner une entreprise</option>

                  {entreprises.map((entreprise) => (
                    <option key={entreprise.id} value={entreprise.id}>
                      {entreprise.nom}
                    </option>
                  ))}
                </select>

                {entreprises.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Aucune entreprise disponible.
                  </p>
                )}
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
                    loadingData ||
                    postes.length === 0 ||
                    entreprises.length === 0
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Création..." : "Créer l'utilisateur"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
