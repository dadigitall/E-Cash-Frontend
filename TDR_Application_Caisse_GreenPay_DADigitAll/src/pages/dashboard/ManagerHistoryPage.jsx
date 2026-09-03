import { useEffect, useState } from "react";

import DashboardHeader from "../../components/manager/dashboard/DashboardHeader";
import HistorySection from "../../components/manager/history/HistorySection";
import api from "../../services/api";

export default function ManagerHistoryPage() {

    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchHistorique() {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/demandes/historique"
            );

            setHistorique(response.data);

        } catch (error) {

            console.error(
                "Erreur historique :",
                error
            );

            setError(
                "Impossible de charger l'historique."
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

            <DashboardHeader />

            <section className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Historique des demandes
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Consultez l'ensemble des demandes
                        précédemment effectuées par les employés.
                    </p>
                </div>


                {loading && (

                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

                        <p className="text-gray-500">
                            Chargement de l'historique...
                        </p>

                    </div>

                )}


                {error && (

                    <div className="bg-red-50 text-red-600 rounded-xl p-4">

                        {error}

                    </div>

                )}


                {!loading && !error && (

                    <HistorySection
                        demandes={historique}
                    />

                )}

            </section>

        </div>

    );
}