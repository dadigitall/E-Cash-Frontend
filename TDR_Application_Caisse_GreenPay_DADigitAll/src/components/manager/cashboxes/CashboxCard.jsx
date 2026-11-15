import { BalanceCard } from "../../ui/DashboardKit";
import { companyFromName } from "../../../theme/companies";

// Si le fichier est dans un autre dossier que components/manager/caisses/,
// ajuste les deux chemins d'import ci-dessus.
export default function CashboxCard({ caisse }) {
  const nom = caisse.entreprise?.nom ?? caisse.nom;

  return (
    <BalanceCard
      label={nom}
      value={Number(caisse.solde || 0)}
      companyKey={companyFromName(nom) ?? undefined}
    />
  );
}
