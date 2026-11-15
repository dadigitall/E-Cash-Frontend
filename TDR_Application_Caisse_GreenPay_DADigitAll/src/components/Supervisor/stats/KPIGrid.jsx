import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import {
  BalanceCard,
  CompanyLogo,
  Reveal,
  StatCard,
  fcfa,
} from "../../ui/DashboardKit";
import { companyFromName } from "../../../theme/companies";

// Props inchangées : stats { solde_total, entrees_mois, sorties_mois } et caisses.
export default function KPIGrid({ stats = {}, caisses = [] }) {
  const solde = Number(stats.solde_total || 0);
  const entrees = Number(stats.entrees_mois || 0);
  const sorties = Number(stats.sorties_mois || 0);
  const ratio = entrees > 0 ? Math.round((sorties / entrees) * 100) : null;

  return (
    <section aria-label="Indicateurs du mois" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr_1fr]">
        <Reveal>
          <BalanceCard
            label="Solde total"
            value={solde}
            ratio={ratio}
            ratioLabel={
              ratio != null
                ? `Les sorties représentent ${ratio} % des entrées du mois`
                : undefined
            }
          />
        </Reveal>
        <Reveal delay={0.08}>
          <StatCard
            label="Entrées du mois"
            value={entrees}
            unit="FCFA"
            icon={ArrowDownLeft}
          />
        </Reveal>
        <Reveal delay={0.16}>
          <StatCard
            label="Sorties du mois"
            value={sorties}
            unit="FCFA"
            icon={ArrowUpRight}
          />
        </Reveal>
      </div>

      {caisses.length > 0 && (
        <Reveal delay={0.24}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {caisses.map((caisse) => {
              const key = companyFromName(caisse.entreprise?.nom ?? caisse.nom);
              return (
                <li
                  key={caisse.id ?? caisse.nom}
                  data-company={key ?? undefined}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
                >
                  {key ? (
                    <CompanyLogo companyKey={key} size={44} />
                  ) : (
                    <span className="size-11 rounded-2xl bg-brand-soft" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">
                      {caisse.nom}
                    </p>
                    <p className="text-sm text-muted">Solde actuel</p>
                  </div>
                  <p className="font-bold tabular-nums text-brand">
                    {fcfa(caisse.solde)}{" "}
                    <small className="font-semibold text-muted">FCFA</small>
                  </p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}
    </section>
  );
}
