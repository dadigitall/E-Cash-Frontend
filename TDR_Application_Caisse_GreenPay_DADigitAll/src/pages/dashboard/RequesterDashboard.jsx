import { useEffect, useState } from "react";
import { FileText, Hourglass, Plus } from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../theme/CompanyThemeProvider";
import { useAcceptedCelebration } from "../../hooks/useAcceptedCelebration";

import NewRequestForm from "../../components/requester/NewRequestForm";
import RequestHistory from "../../components/requester/RequestHistory";
import MoneyFlow from "../../components/ui/MoneyFlow";
import {
  HeroBanner,
  Pagination,
  Reveal,
  StatCard,
} from "../../components/ui/DashboardKit";

const ACTIVE_STATUSES = ["en_attente", "acceptee", "preuve_envoyee"];

export default function RequesterDashboard() {
  const { user: auth } = useAuth();
  const user = auth?.user ?? auth;
  const { company } = useCompany();

  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsPagination, setRequestsPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Billets qui entrent quand une demande acceptée n'a pas encore été fêtée
  const [moneyEvent, clearMoneyEvent] = useAcceptedCelebration(
    requests,
    user?.id,
  );

  const prenom = user?.name?.split(" ")[0];
  const activeCount = requests.filter((r) =>
    ACTIVE_STATUSES.includes(r.statut),
  ).length;
  const hasActiveRequest = activeCount > 0;

  // =====================================================
  // DEMANDES (seules données chargées côté employé)
  // =====================================================

  async function fetchRequests(page = 1) {
    try {
      const response = await api.get(`/demandes/mes-demandes?page=${page}`);

      setRequests(
        Array.isArray(response.data)
          ? response.data
          : (response.data.data ?? []),
      );

      if (response.data.data) {
        setRequestsPagination({
          current_page: response.data.current_page ?? 1,
          last_page: response.data.last_page ?? 1,
          per_page: response.data.per_page ?? 10,
          total: response.data.total ?? 0,
        });
      }
    } catch (error) {
      console.error(
        "Erreur récupération demandes :",
        error.response?.data || error,
      );
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function addRequest() {
    await fetchRequests(1);
    setShowForm(false);
  }

  function changerPage(page) {
    if (page < 1 || page > requestsPagination.last_page) return;
    fetchRequests(page);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Reveal>
        <HeroBanner
          companyKey={company?.key}
          title={prenom ? `Bonjour, ${prenom}` : "Mes dépenses"}
          subtitle={
            company
              ? `${company.nom} · Mes demandes de dépenses`
              : "Mes demandes de dépenses"
          }
        >
          {!hasActiveRequest && !showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-brand-deep shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              <Plus size={18} />
              Nouvelle demande
            </button>
          )}
        </HeroBanner>
      </Reveal>

      {/* ---------- Indicateurs personnels ---------- */}
      <Reveal delay={0.1}>
        <section className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Demandes en cours"
            value={activeCount}
            icon={Hourglass}
          />
          <StatCard
            label="Demandes au total"
            value={requestsPagination.total || requests.length}
            icon={FileText}
          />
        </section>
      </Reveal>

      {showForm && (
        <NewRequestForm
          onClose={() => setShowForm(false)}
          onAddRequest={addRequest}
        />
      )}

      {hasActiveRequest && !showForm && (
        <Reveal delay={0.15}>
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
          >
            <h3 className="font-semibold text-amber-800">
              Une demande est déjà en cours
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Vous pourrez créer une nouvelle demande lorsque votre demande
              actuelle sera terminée ou rejetée.
            </p>
          </div>
        </Reveal>
      )}

      {/* ---------- Historique ---------- */}
      <Reveal delay={0.2}>
        <RequestHistory
          requests={requests}
          onProofUploaded={() => fetchRequests(requestsPagination.current_page)}
        />
      </Reveal>

      <Pagination
        current={requestsPagination.current_page}
        last={requestsPagination.last_page}
        total={requestsPagination.total}
        onChange={changerPage}
      />

      <MoneyFlow event={moneyEvent} onDone={clearMoneyEvent} />
    </div>
  );
}
