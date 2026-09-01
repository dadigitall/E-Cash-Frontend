import { useEffect, useState } from "react";
import api from "../../services/api";
import AddCaisseModal from "../../components/manager/caisses/AddCaisseModal";

export default function CashboxesPage() {

    const [caisses, setCaisses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCaisseModalOpen, setIsCaisseModalOpen] = useState(false);

    async function fetchCaisses() {

        try {

            setLoading(true);

            const response = await api.get("/caisses");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];

            setCaisses(data);

        } catch (error) {

            console.error(
                "Erreur récupération des caisses :",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {
        fetchCaisses();
    }, []);

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Caisses
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Retrouvez ici toutes les caisses de l'entreprise.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => setIsCaisseModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                >
                    + Ajouter une caisse
                </button>

            </div>

            {loading ? (

                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    Chargement des caisses...
                </div>

            ) : caisses.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-8 text-center">

                    <p className="text-gray-500">
                        Aucune caisse n'est disponible.
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsCaisseModalOpen(true)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                    >
                        + Créer la première caisse
                    </button>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {caisses.map((caisse) => (

                        <div
                            key={caisse.id}
                            className="bg-white rounded-xl shadow p-6"
                        >

                            <h2 className="text-xl font-semibold">
                                {caisse.nom}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {caisse.entreprise?.nom ||
                                    "Entreprise non définie"}
                            </p>

                            <div className="mt-6">

                                <p className="text-sm text-gray-500">
                                    Solde
                                </p>

                                <p className="text-2xl font-bold mt-1">
                                    {Number(
                                        caisse.solde || 0
                                    ).toLocaleString("fr-FR")}{" "}
                                    FCFA
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            <AddCaisseModal
                isOpen={isCaisseModalOpen}
                onClose={() =>
                    setIsCaisseModalOpen(false)
                }
                onSuccess={async () => {
                    await fetchCaisses();
                    setIsCaisseModalOpen(false);
                }}
            />

        </div>

    );

}