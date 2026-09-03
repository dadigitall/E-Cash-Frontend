import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileDown,
  FileSpreadsheet,
  Loader2,
  Inbox,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function Rapport() {
  const [rapport, setRapport] = useState(null);
  const [entreprises, setEntreprises] = useState([]);

  const [periode, setPeriode] = useState("mois");
  const [dateDebutJour, setDateDebutJour] = useState("");
  const [dateDebutMois, setDateDebutMois] = useState("");
  const [dateDebutAnnee, setDateDebutAnnee] = useState("");
  const [dateFinJour, setDateFinJour] = useState("");
  const [dateFinMois, setDateFinMois] = useState("");
  const [dateFinAnnee, setDateFinAnnee] = useState("");

  const dateDebut =
    dateDebutJour && dateDebutMois && dateDebutAnnee
      ? `${dateDebutAnnee}-${String(dateDebutMois).padStart(2, "0")}-${String(dateDebutJour).padStart(2, "0")}`
      : "";

  const dateFin =
    dateFinJour && dateFinMois && dateFinAnnee
      ? `${dateFinAnnee}-${String(dateFinMois).padStart(2, "0")}-${String(dateFinJour).padStart(2, "0")}`
      : "";

  const [entrepriseId, setEntrepriseId] = useState("");
  const [type, setType] = useState("tout");

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }),
    [token],
  );

  useEffect(() => {
    if (!token) {
      setError("Session expirée, veuillez vous reconnecter.");
      return;
    }

    const chargerEntreprises = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/entreprises`, {
          headers,
        });
        setEntreprises(response.data);
      } catch (err) {
        console.error("Erreur chargement entreprises :", err);
        setError("Impossible de charger les entreprises.");
      }
    };

    chargerEntreprises();
  }, [headers, token]);

  const chargerRapport = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const params = {
        periode,
        type_mouvement: type,
      };

      if (entrepriseId) {
        params.entreprise_id = entrepriseId;
      }

      if (periode === "personnalise") {
        params.date_debut = dateDebut;
        params.date_fin = dateFin;
      }

      const response = await axios.get(`${API_BASE_URL}/rapports/mouvements`, {
        headers,
        params,
      });

      setRapport(response.data);
    } catch (err) {
      console.error("Erreur chargement rapport :", err);
      setError(
        err.response?.data?.message || "Impossible de générer le rapport.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerRapport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(montant || 0));
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    chargerRapport();
  };

  // Le solde cumulé n'est fiable que si on affiche entrées ET sorties.
  // Filtré sur un seul type, on le masque pour éviter d'afficher un solde faux.
  const soldeFiable = type === "tout";

  const mouvementsParCaisse = useMemo(() => {
    if (!rapport?.mouvements) return {};

    const groupes = {};

    const tries = [...rapport.mouvements].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    tries.forEach((mvt) => {
      if (!groupes[mvt.caisse]) {
        groupes[mvt.caisse] = {
          solde: Number(mvt.solde_avant ?? 0),
          lignes: [],
        };
      }

      const signe = mvt.type === "entree" ? 1 : -1;
      groupes[mvt.caisse].solde += signe * Number(mvt.montant);

      groupes[mvt.caisse].lignes.push({
        ...mvt,
        solde_apres: soldeFiable ? groupes[mvt.caisse].solde : null,
      });
    });

    return groupes;
  }, [rapport, soldeFiable]);

  const exporter = async (format) => {
    if (!token) return;

    setExporting(true);
    setError("");

    try {
      const params = {
        periode,
        type_mouvement: type,
      };

      if (entrepriseId) {
        params.entreprise_id = entrepriseId;
      }

      if (periode === "personnalise") {
        params.date_debut = dateDebut;
        params.date_fin = dateFin;
      }

      const url =
        format === "pdf"
          ? `${API_BASE_URL}/rapports/export/pdf`
          : `${API_BASE_URL}/rapports/export/excel`;

      const response = await axios.get(url, {
        headers,
        params,
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute(
        "download",
        format === "pdf" ? "rapport.pdf" : "rapport.xlsx",
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Erreur export :", err);
      setError("Impossible d'exporter le rapport.");
    } finally {
      setExporting(false);
    }
  };

  const soldeNet = rapport
    ? Number(rapport.total_entrees) - Number(rapport.total_sorties)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rapport financier</h1>
        <p className="mt-1 text-gray-500">
          Consultez les mouvements financiers des caisses selon l'entreprise et
          la période sélectionnées.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Paramètres du rapport</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label
              htmlFor="periode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Période
            </label>
            <select
              id="periode"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="jour">Aujourd'hui</option>
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="personnalise">Personnalisée</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="entreprise"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Entreprise
            </label>
            <select
              id="entreprise"
              value={entrepriseId}
              onChange={(e) => setEntrepriseId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Toutes les entreprises</option>
              {entreprises.map((entreprise) => (
                <option key={entreprise.id} value={entreprise.id}>
                  {entreprise.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="type-mouvement"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mouvements
            </label>
            <select
              id="type-mouvement"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="tout">Entrées et sorties</option>
              <option value="entrees">Entrées uniquement</option>
              <option value="sorties">Sorties uniquement</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Génération..." : "Générer le rapport"}
            </button>
          </div>

          {periode === "personnalise" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <div className="flex gap-2">
                  <select
                    aria-label="Jour de début"
                    value={dateDebutJour}
                    onChange={(e) => setDateDebutJour(e.target.value)}
                    className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                    required
                  >
                    <option value="">Jour</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Mois de début"
                    value={dateDebutMois}
                    onChange={(e) => setDateDebutMois(e.target.value)}
                    className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                    required
                  >
                    <option value="">Mois</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Année de début"
                    value={dateDebutAnnee}
                    onChange={(e) => setDateDebutAnnee(e.target.value)}
                    className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                    required
                  >
                    <option value="">Année</option>
                    {Array.from(
                      { length: 6 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <div className="flex gap-2">
                  <select
                    aria-label="Jour de fin"
                    value={dateFinJour}
                    onChange={(e) => setDateFinJour(e.target.value)}
                    className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                    required
                  >
                    <option value="">Jour</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Mois de fin"
                    value={dateFinMois}
                    onChange={(e) => setDateFinMois(e.target.value)}
                    className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                    required
                  >
                    <option value="">Mois</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Année de fin"
                    value={dateFinAnnee}
                    onChange={(e) => setDateFinAnnee(e.target.value)}
                    className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                    required
                  >
                    <option value="">Année</option>
                    {Array.from(
                      { length: 6 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {rapport && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="absolute top-0 left-0 h-full w-1 bg-green-500" />
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Total entrées
                </p>
                <div className="rounded-full bg-green-50 p-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {formatMontant(rapport.total_entrees)}
                <span className="text-base font-medium text-gray-400 ml-1">
                  FCFA
                </span>
              </p>
            </div>

            <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="absolute top-0 left-0 h-full w-1 bg-red-500" />
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Total sorties
                </p>
                <div className="rounded-full bg-red-50 p-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2 text-red-600">
                {formatMontant(rapport.total_sorties)}
                <span className="text-base font-medium text-gray-400 ml-1">
                  FCFA
                </span>
              </p>
            </div>

            <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div
                className={`absolute top-0 left-0 h-full w-1 ${soldeNet >= 0 ? "bg-blue-900" : "bg-red-500"}`}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Solde net période
                </p>
                <div className="rounded-full bg-blue-50 p-2">
                  <Wallet className="h-4 w-4 text-blue-900" />
                </div>
              </div>
              <p
                className={`text-3xl font-bold mt-2 ${soldeNet >= 0 ? "text-blue-900" : "text-red-600"}`}
              >
                {formatMontant(soldeNet)}
                <span className="text-base font-medium text-gray-400 ml-1">
                  FCFA
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Période :</span>{" "}
              {formatDate(rapport.periode?.debut)} →{" "}
              {formatDate(rapport.periode?.fin)}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => exporter("excel")}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                )}
                Excel
              </button>
              <button
                onClick={() => exporter("pdf")}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                PDF
              </button>
            </div>
          </div>

          {!soldeFiable && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Le solde cumulé n'est pas affiché car un filtre "entrées
              uniquement" ou "sorties uniquement" est actif : il ne refléterait
              pas le vrai solde de caisse.
            </p>
          )}

          {Object.keys(mouvementsParCaisse).length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Aucun mouvement trouvé pour cette période.
              </p>
            </div>
          ) : (
            Object.entries(mouvementsParCaisse).map(
              ([nomCaisse, { lignes }]) => (
                <div
                  key={nomCaisse}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">
                      {nomCaisse}
                    </h2>
                    <span className="text-xs text-gray-400">
                      {lignes.length} mouvement{lignes.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Date
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Type
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Libellé
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Détail source
                          </th>
                          <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Montant
                          </th>
                          <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Solde
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lignes.map((mvt) => (
                          <tr
                            key={
                              mvt.id ??
                              `${mvt.caisse}-${mvt.date}-${mvt.montant}`
                            }
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors odd:bg-gray-50/30"
                          >
                            <td className="px-5 py-3 text-gray-600">
                              {formatDate(mvt.date)}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  mvt.type === "entree"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {mvt.type === "entree" ? "Entrée" : "Sortie"}
                              </span>
                            </td>
                            <td className="px-5 py-3 font-medium text-gray-800">
                              {mvt.libelle}
                            </td>
                            <td className="px-5 py-3 text-xs italic text-gray-400">
                              {mvt.detail_source ?? "—"}
                            </td>
                            <td
                              className={`px-5 py-3 text-right font-semibold ${
                                mvt.type === "entree"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {mvt.type === "entree" ? "+ " : "− "}
                              {formatMontant(mvt.montant)} FCFA
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-gray-900">
                              {mvt.solde_apres === null
                                ? "—"
                                : `${formatMontant(mvt.solde_apres)} FCFA`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ),
            )
          )}
        </>
      )}
    </div>
  );
}
