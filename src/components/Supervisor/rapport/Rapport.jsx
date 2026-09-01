import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

    const dateDebut = dateDebutJour && dateDebutMois && dateDebutAnnee
        ? `${dateDebutAnnee}-${String(dateDebutMois).padStart(2, "0")}-${String(dateDebutJour).padStart(2, "0")}`
        : "";

    const dateFin = dateFinJour && dateFinMois && dateFinAnnee
        ? `${dateFinAnnee}-${String(dateFinMois).padStart(2, "0")}-${String(dateFinJour).padStart(2, "0")}`
        : "";
    const [entrepriseId, setEntrepriseId] = useState("");
    const [type, setType] = useState("tout");

    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const headers = useMemo(
        () => ({
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        }),
        [token]
    );

    useEffect(() => {
        const chargerEntreprises = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/entreprises",
                    { headers }
                );
                setEntreprises(response.data);
            } catch (err) {
                console.error("Erreur chargement entreprises :", err);
                setError("Impossible de charger les entreprises.");
            }
        };

        chargerEntreprises();
    }, [headers]);

    const chargerRapport = async () => {
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

            const response = await axios.get(
                "http://127.0.0.1:8000/api/rapports/mouvements",
                { headers, params }
            );

            setRapport(response.data);
        } catch (err) {
            console.error("Erreur chargement rapport :", err);
            setError(
                err.response?.data?.message ||
                    "Impossible de générer le rapport."
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        chargerRapport();
    };

    // Regroupe les mouvements par caisse, triés chronologiquement,
    // avec le solde progressif (nécessite solde_debut_periode par caisse,
    // renvoyé par le backend — voir note ci-dessous)
    const mouvementsParCaisse = useMemo(() => {
        if (!rapport?.mouvements) return {};

        const groupes = {};

        // Tri chronologique croissant pour calculer le solde progressif
        const tries = [...rapport.mouvements].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
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
                solde_apres: groupes[mvt.caisse].solde,
            });
        });

        return groupes;
    }, [rapport]);

    const exporter = async (format) => {
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
                    ? "http://127.0.0.1:8000/api/rapports/export/pdf"
                    : "http://127.0.0.1:8000/api/rapports/export/excel";

            const response = await axios.get(url, {
                headers,
                params,
                responseType: "blob",
            });

            const blobUrl = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute(
                "download",
                format === "pdf" ? "rapport.pdf" : "rapport.xlsx"
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Rapport financier
                </h1>
                <p className="mt-1 text-gray-500">
                    Consultez les mouvements financiers des caisses selon
                    l'entreprise et la période sélectionnées.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Paramètres du rapport
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Période
                        </label>
                        <select
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Entreprise
                        </label>
                        <select
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mouvements
                        </label>
                        <select
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
                            className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
                        >
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
                                        value={dateDebutJour}
                                        onChange={(e) => setDateDebutJour(e.target.value)}
                                        className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                                        required
                                    >
                                        <option value="">Jour</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((j) => (
                                            <option key={j} value={j}>{j}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={dateDebutMois}
                                        onChange={(e) => setDateDebutMois(e.target.value)}
                                        className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                                        required
                                    >
                                        <option value="">Mois</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={dateDebutAnnee}
                                        onChange={(e) => setDateDebutAnnee(e.target.value)}
                                        className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                                        required
                                    >
                                        <option value="">Année</option>
                                        {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((a) => (
                                            <option key={a} value={a}>{a}</option>
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
                                        value={dateFinJour}
                                        onChange={(e) => setDateFinJour(e.target.value)}
                                        className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                                        required
                                    >
                                        <option value="">Jour</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((j) => (
                                            <option key={j} value={j}>{j}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={dateFinMois}
                                        onChange={(e) => setDateFinMois(e.target.value)}
                                        className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                                        required
                                    >
                                        <option value="">Mois</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={dateFinAnnee}
                                        onChange={(e) => setDateFinAnnee(e.target.value)}
                                        className="w-1/3 rounded-lg border border-gray-300 px-2 py-2"
                                        required
                                    >
                                        <option value="">Année</option>
                                        {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((a) => (
                                            <option key={a} value={a}>{a}</option>
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
                        <div className="bg-white border rounded-xl p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Total entrées</p>
                            <p className="text-2xl font-bold mt-1 text-green-600">
                                {formatMontant(rapport.total_entrees)} FCFA
                            </p>
                        </div>

                        <div className="bg-white border rounded-xl p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Total sorties</p>
                            <p className="text-2xl font-bold mt-1 text-red-600">
                                {formatMontant(rapport.total_sorties)} FCFA
                            </p>
                        </div>

                        <div className="bg-white border rounded-xl p-5 shadow-sm">
                            <p className="text-sm text-gray-500">Solde net période</p>
                            <p className="text-2xl font-bold mt-1">
                                {formatMontant(
                                    Number(rapport.total_entrees) -
                                        Number(rapport.total_sorties)
                                )}{" "}
                                FCFA
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 border rounded-lg p-4">
                        <span className="font-medium">Période du rapport :</span>{" "}
                        {formatDate(rapport.periode?.debut)} →{" "}
                        {formatDate(rapport.periode?.fin)}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => exporter("excel")}
                            disabled={exporting}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            {exporting ? "Export..." : "Exporter Excel"}
                        </button>
                        <button
                            onClick={() => exporter("pdf")}
                            disabled={exporting}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {exporting ? "Export..." : "Exporter PDF"}
                        </button>
                    </div>

                    {Object.keys(mouvementsParCaisse).length === 0 ? (
                        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                            Aucun mouvement trouvé pour cette période.
                        </div>
                    ) : (
                        Object.entries(mouvementsParCaisse).map(
                            ([nomCaisse, { lignes }]) => (
                                <div
                                    key={nomCaisse}
                                    className="bg-white border rounded-xl shadow-sm overflow-hidden"
                                >
                                    <div className="p-5 border-b">
                                        <h2 className="text-lg font-semibold">
                                            {nomCaisse}
                                        </h2>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left px-4 py-3">Date</th>
                                                    <th className="text-left px-4 py-3">Type</th>
                                                    <th className="text-left px-4 py-3">Libellé</th>
                                                    <th className="text-right px-4 py-3">Montant</th>
                                                    <th className="text-right px-4 py-3">Solde</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {lignes.map((mvt, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3">
                                                            {formatDate(mvt.date)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs ${
                                                                    mvt.type === "entree"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {mvt.type === "entree"
                                                                    ? "Entrée"
                                                                    : "Sortie"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {mvt.libelle}
                                                        </td>
                                                        <td
                                                            className={`px-4 py-3 text-right font-medium ${
                                                                mvt.type === "entree"
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {mvt.type === "entree" ? "+" : "-"}
                                                            {formatMontant(mvt.montant)} FCFA
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-semibold">
                                                            {formatMontant(mvt.solde_apres)} FCFA
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        )
                    )}
                </>
            )}
        </div>
    );
}