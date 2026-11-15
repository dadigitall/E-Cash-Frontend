import { BalanceCard, Reveal } from "../ui/DashboardKit";
import { companyFromName } from "../../theme/companies";

// Props inchangées : caisses (GreenPay, DA Digit All) et totalCaisses.
export default function StatsCards({ caisses = [], totalCaisses = 0 }) {
  const total = caisses.reduce((t, c) => t + Number(c.solde || 0), 0);
  const pluriel = totalCaisses > 1 ? "s" : "";

  return (
    <section
      aria-label="Soldes des caisses"
      className="space-y-3"
      translate="no"
    >
      {/* Un seul nœud texte : plus de fragments qui apparaissent/disparaissent */}
      <p className="text-sm text-muted">
        {`${totalCaisses} caisse${pluriel} enregistrée${pluriel}`}
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Reveal>
          <BalanceCard label="Solde total" value={total} />
        </Reveal>

        {caisses.map((caisse, i) => (
          <Reveal key={caisse.id ?? caisse.nom} delay={0.08 * (i + 1)}>
            <BalanceCard
              label={caisse.nom}
              value={Number(caisse.solde || 0)}
              companyKey={companyFromName(caisse.nom) ?? undefined}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
