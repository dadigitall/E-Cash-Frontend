import { useEffect, useState } from "react";
import api from "../../services/api";
import RequestHistory from "../../components/manager/requests/RequestHistory";

export default function ManagerRequestHistoryPage() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchHistorique() {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/demandes/historique");

            setDemandes(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement de l'historique :", error);

            setError(
                error.response?.data?.message ||
                "Impossible de charger l'historique des demandes."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHistorique();
    }, []);

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold">
                    Historique des demandes
                </h1>

                <p className="text-gray-500 mt-1">
                    Consultez l'ensemble des demandes effectuées par les employés.
                </p>
            </div>

            {loading && (
                <p className="text-gray-500">
                    Chargement de l'historique...
                </p>
            )}

            {error && (
                <div className="border border-red-200 bg-red-50 text-red-600 rounded-xl p-4">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <RequestHistory demandes={demandes} />
            )}

        </div>
    );
}