import { useEffect, useState } from "react";

import api from "../../services/api";

import LoanList from "../../components/manager/loans/LoanList";

export default function IntercashLoansPage() {

    const [emprunts, setEmprunts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    async function fetchEmprunts() {

        try {

            setLoading(true);
            setError(null);

            const response = await api.get("/emprunts");

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ?? [];

            setEmprunts(data);

        } catch (error) {

            console.error(
                "Erreur récupération emprunts intercaisses :",
                error.response?.data ?? error
            );

            setError(
                "Impossible de charger les emprunts intercaisses."
            );

        } finally {

            setLoading(false);

        }

    }


    async function handleRepay(id) {

        try {

            await api.post(`/emprunts/${id}/rembourser`);

            await fetchEmprunts();

        } catch (error) {

            console.error(
                "Erreur remboursement emprunt :",
                error.response?.data ?? error
            );

            alert(
                error.response?.data?.message ||
                "Impossible de régulariser cet emprunt."
            );

        }

    }

    useEffect(() => {

        fetchEmprunts();

    }, []);


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Emprunts intercaisses
                </h1>

                <p className="mt-1 text-gray-500">
                    Consultez et régularisez les échanges financiers entre les différentes caisses.
                </p>

            </div>


            {!loading && error && (

                <div className="rounded-lg bg-red-50 p-6">

                    <p className="text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchEmprunts}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        Réessayer
                    </button>

                </div>

            )}


            {(!error) && (

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                    <LoanList
                        emprunts={emprunts}
                        onRepay={handleRepay}
                        loading={loading}
                    />

                </div>

            )}

        </div>

    );

}