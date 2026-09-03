import { useEffect, useState } from "react";
import api from "../../services/api";
import TelephoneField from "./TelephoneField";

export default function EditEmployeeModal({
  isOpen,
  employee,
  entreprises,
  onClose,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [entrepriseId, setEntrepriseId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.name ?? "");
      setEmail(employee.email ?? "");
      setTelephone(employee.telephone_whatsapp ?? "");
      setEntrepriseId(
        employee.entreprise?.id ? String(employee.entreprise.id) : "",
      );
      setError("");
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  async function handleSubmit() {
    setError("");

    if (!name || !email) {
      setError("Le nom et l'email sont obligatoires.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/users/${employee.id}`, {
        name,
        email,
        telephone_whatsapp: telephone,
        entreprise_id: entrepriseId,
      });
      onSuccess();
    } catch (err) {
      console.error("Erreur modification employé :", err.response?.data ?? err);
      setError(
        err.response?.data?.message ?? "Impossible de modifier cet employé.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Modifier l'employé
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <TelephoneField value={telephone} onChange={setTelephone} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entreprise
          </label>
          <select
            value={entrepriseId}
            onChange={(e) => setEntrepriseId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">— Sélectionner —</option>
            {entreprises.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.nom}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
