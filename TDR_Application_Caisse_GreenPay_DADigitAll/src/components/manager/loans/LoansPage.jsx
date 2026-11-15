import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import BorrowModal from "../../components/manager/loans/BorrowModal";
import LoanList from "../../components/manager/loans/LoanList";
import { Reveal } from "../../components/ui/DashboardKit";
import { primaryBtnClass } from "../../components/ui/styles";
import { useForceNeutralTheme } from "../../theme/CompanyThemeProvider";
import api from "../../services/api";

const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

export default function LoansPage() {
  useForceNeutralTheme();

  const [caisses, setCaisses] = useState([]);
  const [emprunts, setEmprunts] = useState([]);

  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [caissesRes, empruntsRes] = await Promise.all([
        api.get("/caisses"),
        api.get("/emprunts"),
      ]);

      setCaisses(toList(caissesRes.data));
      setEmprunts(toList(empruntsRes.data));
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Impossible de charger les données.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Pas de try/catch ici : en cas d'échec l'erreur remonte à la modale,
  // qui affiche le message et reste ouverte. Elle se ferme seule en cas de succès.
  async function handleCreateBorrow(data) {
    await api.post("/emprunts", data);
    await fetchData();
  }

  async function handleRepay(id) {
    const confirmation = window.confirm(
      "Voulez-vous vraiment enregistrer le remboursement de cet emprunt ?",
    );

    if (!confirmation) {
      return;
    }

    try {
      setError("");

      await api.post(`/emprunts/${id}/rembourser`);

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Impossible de rembourser cet emprunt.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Emprunts inter-caisses
          </h1>
          <p className="mt-1 text-muted">
            Gérez les transferts temporaires de fonds entre les caisses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBorrowModal(true)}
          className={`${primaryBtnClass} inline-flex items-center gap-2`}
        >
          <Plus size={18} />
          Nouvel emprunt
        </button>
      </Reveal>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700"
        >
          {error}
        </div>
      )}

      <Reveal delay={0.1}>
        <section className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-ink">
            Historique des emprunts
          </h2>

          <LoanList
            emprunts={emprunts}
            onRepay={handleRepay}
            loading={loading}
          />
        </section>
      </Reveal>

      <BorrowModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        caisses={caisses}
        onSuccess={handleCreateBorrow}
      />
    </div>
  );
}
