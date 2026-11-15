import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserPlus } from "lucide-react";

import DashboardHeader from "../../components/manager/dashboard/DashboardHeader";
import StatsCards from "../../components/manager/StatsCards";
import AlertSoldeInsuffisant from "../../components/manager/AlertSoldeInsuffisant";
import PendingRequests from "../../components/manager/requests/PendingRequests";
import HistorySection from "../../components/manager/history/HistorySection";
import QuickActions from "../../components/manager/actions/QuickActions";
import PendingProofs from "../../components/manager/proofs/PendingProofs";
import ProofViewerModal from "../../components/manager/proofs/ProofViewerModal";
import BorrowModal from "../../components/manager/loans/BorrowModal";
import AddRequesterModal from "../../components/users/AddRequesterModal";
import ChooseCaisseModal from "../../components/manager/requests/ChooseCaisseModal";
import SupplyCaisseModal from "../../components/manager/caisses/SupplyCaisseModal";
import MoneyFlow from "../../components/ui/MoneyFlow";
import { Pagination, Reveal } from "../../components/ui/DashboardKit";
import { useForceNeutralTheme } from "../../theme/CompanyThemeProvider";
import { normaliser } from "../../theme/companies";
import api from "../../services/api";

const NOMS_CAISSES_BASE = ["greenpay", "da digit all"];

export default function ManagerDashboard() {
  // Le manager voit les deux entreprises : thème neutre
  useForceNeutralTheme();

  const location = useLocation();
  const isHistorique = location.pathname === "/dashboard/historique";

  const [caisses, setCaisses] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [preuves, setPreuves] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [historiquePage, setHistoriquePage] = useState(1);

  const [historiquePagination, setHistoriquePagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isRequesterModalOpen, setIsRequesterModalOpen] = useState(false);
  const [isCaisseChoiceModalOpen, setIsCaisseChoiceModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);

  // Preuve affichée dans la fenêtre
  const [selectedProof, setSelectedProof] = useState(null);

  // Animation des billets : { id, direction: "in" | "out", amount, label }
  const [moneyFlow, setMoneyFlow] = useState(null);

  // =====================================================
  // CHARGEMENT DES DONNÉES
  // =====================================================

  useEffect(() => {
    if (isHistorique) {
      fetchHistorique();
    } else {
      fetchDashboard();
    }
  }, [isHistorique]);

  const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

  async function fetchDashboard() {
    // allSettled : une route qui échoue ne bloque plus les deux autres
    const [caissesRes, demandesRes, preuvesRes] = await Promise.allSettled([
      api.get("/caisses"),
      api.get("/demandes/en-attente"),
      api.get("/preuves/en-attente"),
    ]);

    const lire = (res, route) => {
      if (res.status === "fulfilled") return toList(res.value.data);

      console.error(
        `Erreur ${route} :`,
        res.reason?.response?.status,
        res.reason?.response?.data ?? res.reason,
      );
      return [];
    };

    setCaisses(lire(caissesRes, "/caisses"));
    setDemandes(lire(demandesRes, "/demandes/en-attente"));
    setPreuves(lire(preuvesRes, "/preuves/en-attente"));
  }

  const caissesDashboard = caisses.filter((caisse) =>
    NOMS_CAISSES_BASE.some((nomBase) =>
      normaliser(caisse.nom).includes(nomBase),
    ),
  );

  // =====================================================
  // HISTORIQUE
  // =====================================================

  async function fetchHistorique(page = 1) {
    try {
      const response = await api.get(`/demandes/historique?page=${page}`);

      setHistorique(toList(response.data));

      setHistoriquePagination({
        current_page: response.data.current_page ?? 1,
        last_page: response.data.last_page ?? 1,
        per_page: response.data.per_page ?? 10,
        total: response.data.total ?? 0,
      });

      setHistoriquePage(response.data.current_page ?? 1);
    } catch (error) {
      console.error("Erreur récupération historique :", error);
    }
  }

  // =====================================================
  // DEMANDES
  // =====================================================

  async function handleValidateWithoutProof(id, commentaire) {
    try {
      await api.post(`/demandes/${id}/valider-sans-preuve`, {
        commentaire_validation: commentaire,
      });

      await fetchDashboard();
    } catch (error) {
      console.error(error);
      console.error(error.response?.data);

      alert(
        error.response?.data?.message ||
          "Impossible de valider cette demande sans preuve.",
      );
      throw error; // pour que la modal affiche l'erreur et arrête le loading
    }
  }

  function handleAccept(id) {
    const demande = demandes.find((d) => d.id === id);
    if (!demande) return;

    setSelectedDemande(demande);
    setIsCaisseChoiceModalOpen(true);
  }

  async function handleConfirmAccept(id, caisseId) {
    // Montant gardé avant que selectedDemande soit remis à null
    const montant = Number(
      selectedDemande?.montant ??
        demandes.find((d) => d.id === id)?.montant ??
        0,
    );

    try {
      await api.post(`/demandes/${id}/accepter`, { caisse_id: caisseId });

      await fetchDashboard();

      setIsCaisseChoiceModalOpen(false);
      setSelectedDemande(null);

      // Billets qui sortent de la caisse
      setMoneyFlow({
        id: Date.now(),
        direction: "out",
        amount: montant,
        label: "Demande acceptée",
      });
    } catch (error) {
      if (error.response?.status === 422) {
        alert(
          error.response.data?.message ||
            "Solde insuffisant pour cette opération.",
        );
      } else {
        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
      }

      throw error; // pour que le loading de la modal s'arrête proprement
    }
  }

  async function handleReject(id) {
    try {
      await api.post(`/demandes/${id}/rejeter`);

      await fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  }

  // =====================================================
  // PREUVES
  // =====================================================

  async function handleValidateProof(id) {
    try {
      await api.post(`/preuves/${id}/valider`);

      await fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRejectProof(id) {
    try {
      await api.post(`/preuves/${id}/rejeter`);

      await fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  }

  // =====================================================
  // EMPRUNT
  // =====================================================

  async function handleBorrow(data) {
    try {
      await api.post("/emprunts", data);

      await fetchDashboard();

      alert("Emprunt enregistré avec succès.");
    } catch (error) {
      console.error("Erreur emprunt :", error);
      console.error(error.response?.data);

      throw error;
    }
  }

  // =====================================================
  // APPROVISIONNEMENT
  // =====================================================

  async function handleSupply(caisseId, donneesApprovisionnement) {
    try {
      await api.post(
        `/caisses/${caisseId}/approvisionner`,
        donneesApprovisionnement,
      );

      await fetchDashboard();
      setIsSupplyModalOpen(false);

      // Billets qui entrent dans la caisse (pas d'alert : elle bloquerait l'animation).
      // Adaptez "montant" au nom exact du champ envoyé par SupplyCaisseModal.
      setMoneyFlow({
        id: Date.now(),
        direction: "in",
        amount: Number(
          donneesApprovisionnement?.montant ??
            donneesApprovisionnement?.amount ??
            0,
        ),
        label: "Caisse approvisionnée",
      });
    } catch (error) {
      console.error("Erreur approvisionnement :", error);
      console.error(error.response?.data);
      throw error;
    }
  }

  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {isHistorique ? (
        // ==========================================
        // PAGE HISTORIQUE
        // ==========================================

        <section className="space-y-6">
          <Reveal>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Historique des demandes
            </h1>
            <p className="mt-1 text-muted">
              Consultez les demandes précédemment effectuées par les employés.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <HistorySection demandes={historique} />
          </Reveal>

          <Pagination
            current={historiquePage}
            last={historiquePagination.last_page}
            total={historiquePagination.total}
            onChange={fetchHistorique}
          />
        </section>
      ) : (
        // ==========================================
        // DASHBOARD PRINCIPAL
        // ==========================================

        <>
          <Reveal className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsRequesterModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep active:scale-[0.98]"
            >
              <UserPlus size={18} />
              Ajouter un utilisateur
            </button>
          </Reveal>

          <StatsCards
            caisses={caissesDashboard}
            totalCaisses={caisses.length}
          />

          <Reveal delay={0.1}>
            <AlertSoldeInsuffisant />
          </Reveal>

          <Reveal delay={0.15}>
            <PendingRequests
              demandes={demandes}
              onAccept={handleAccept}
              onValidateWithoutProof={handleValidateWithoutProof}
              onReject={handleReject}
            />
          </Reveal>

          <Reveal delay={0.2}>
            <PendingProofs
              preuves={preuves}
              onValidate={handleValidateProof}
              onReject={handleRejectProof}
              onView={setSelectedProof}
            />
          </Reveal>

          <Reveal delay={0.25}>
            <QuickActions
              onBorrow={() => setIsBorrowModalOpen(true)}
              onSupply={() => setIsSupplyModalOpen(true)}
            />
          </Reveal>

          <SupplyCaisseModal
            isOpen={isSupplyModalOpen}
            onClose={() => setIsSupplyModalOpen(false)}
            caisses={caisses}
            onSuccess={handleSupply}
          />

          <BorrowModal
            isOpen={isBorrowModalOpen}
            onClose={() => setIsBorrowModalOpen(false)}
            caisses={caisses}
            onSuccess={handleBorrow}
          />

          <AddRequesterModal
            isOpen={isRequesterModalOpen}
            onClose={() => setIsRequesterModalOpen(false)}
          />

          <ChooseCaisseModal
            isOpen={isCaisseChoiceModalOpen}
            onClose={() => {
              setIsCaisseChoiceModalOpen(false);
              setSelectedDemande(null);
            }}
            demande={selectedDemande}
            caisses={caisses}
            onConfirm={handleConfirmAccept}
          />

          <ProofViewerModal
            preuve={selectedProof}
            onClose={() => setSelectedProof(null)}
            onValidate={handleValidateProof}
            onReject={handleRejectProof}
          />
        </>
      )}

      <MoneyFlow event={moneyFlow} onDone={() => setMoneyFlow(null)} />
    </div>
  );
}
