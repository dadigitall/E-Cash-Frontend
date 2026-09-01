import { useEffect, useState } from "react";
import BorrowModal from "../../components/manager/loans/BorrowModal";
import LoanList from "../../components/manager/loans/LoanList";
import api from "../../services/api";

export default function LoansPage() {
    const [caisses, setCaisses] = useState([]);
    const [emprunts, setEmprunts] = useState([]);

    const [showBorrowModal, setShowBorrowModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    async function fetchData() {
        try {
            setLoading(true);
            setError("");

            const [caissesRes, empruntsRes] = await Promise.all([
                api.get("/caisses"),
                api.get("/emprunts"),
            ]);

            setCaisses(caissesRes.data);
            setEmprunts(empruntsRes.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Impossible de charger les données."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function handleCreateBorrow(data) {
        try {
            setSubmitting(true);
            setError("");

            await api.post("/emprunts", data);

            setShowBorrowModal(false);

            await fetchData();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Impossible d'enregistrer l'emprunt."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleRepay(id) {
        const confirmation = window.confirm(
            "Voulez-vous vraiment enregistrer le remboursement de cet emprunt ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            setError("");

            await api.post(`/emprunts/${id}/rembourser`);

            await fetchData();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Impossible de rembourser cet emprunt."
            );
        }
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold">
                        Emprunts inter-caisses
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Gérez les transferts temporaires de fonds entre les caisses.
                    </p>
                </div>

                <button
                    onClick={() => setShowBorrowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg"
                >
                    Nouvel emprunt
                </button>

            </div>

            {error && (
                <div className="border border-red-200 bg-red-50 text-red-600 rounded-xl p-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border p-6">

                <h2 className="text-xl font-semibold mb-5">
                    Historique des emprunts
                </h2>

                <LoanList
                    emprunts={emprunts}
                    onRepay={handleRepay}
                    loading={loading}
                />

            </div>

            <BorrowModal
                isOpen={showBorrowModal}
                onClose={() => setShowBorrowModal(false)}
                caisses={caisses}
                onSubmit={handleCreateBorrow}
                loading={submitting}
            />

        </div>
    );
}