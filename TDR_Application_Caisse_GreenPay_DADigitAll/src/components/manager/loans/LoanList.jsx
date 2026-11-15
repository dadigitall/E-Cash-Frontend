import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import { CompanyLogo, Pagination, Reveal, fcfa } from "../../ui/DashboardKit";
import { outlineBtnClass } from "../../ui/styles";
import { companyFromName } from "../../../theme/companies";

const PAR_PAGE = 10;

function Caisse({ caisse }) {
  const key = companyFromName(caisse?.entreprise?.nom ?? caisse?.nom);

  return (
    <span className="flex min-w-0 items-center gap-2">
      {key && <CompanyLogo companyKey={key} size={34} />}
      <span className="truncate font-semibold text-ink">{caisse?.nom}</span>
    </span>
  );
}

export default function LoanList({ emprunts, onRepay, loading = false }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(emprunts.length / PAR_PAGE));

  const empruntsPage = emprunts.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  // Revenir à la page 1 si la liste change (ex : après un remboursement)
  useEffect(() => {
    setPage(1);
  }, [emprunts.length]);

  if (loading) {
    return <p className="text-muted">Chargement des emprunts...</p>;
  }

  if (emprunts.length === 0) {
    return <p className="text-muted">Aucun emprunt enregistré.</p>;
  }

  return (
    <div className="space-y-4">
      {empruntsPage.map((emprunt, i) => {
        const preteuse = emprunt.caisse_preteuse || emprunt.caissePreteuse;
        const emprunteuse =
          emprunt.caisse_emprunteuse || emprunt.caisseEmprunteuse;

        const estEnCours =
          emprunt.statut === "en_cours" || emprunt.statut === "en cours";

        const date = new Date(
          emprunt.date_emprunt ?? emprunt.created_at,
        ).toLocaleDateString("fr-FR");

        return (
          <Reveal key={emprunt.id} delay={Math.min(i * 0.04, 0.3)}>
            <article className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Caisse caisse={preteuse} />
                    <ArrowRight size={18} className="shrink-0 text-muted" />
                    <Caisse caisse={emprunteuse} />
                  </div>

                  <p className="mt-3 text-muted">{emprunt.motif}</p>
                  <p className="mt-1 text-sm text-muted">{date}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums text-ink">
                    {fcfa(emprunt.montant)} FCFA
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3.5 py-1 text-sm font-semibold ${
                      estEnCours
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {estEnCours ? "En cours" : "Remboursé"}
                  </span>
                </div>
              </div>

              {estEnCours && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRepay(emprunt.id)}
                    className={outlineBtnClass}
                  >
                    Rembourser
                  </button>
                </div>
              )}
            </article>
          </Reveal>
        );
      })}

      <Pagination
        current={page}
        last={totalPages}
        total={emprunts.length}
        onChange={setPage}
      />
    </div>
  );
}
