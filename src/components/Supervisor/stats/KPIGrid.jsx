import KpiCard from "./KpiCard";

export default function KPIGrid({ stats, caisses }) {

    const soldeTotal = caisses.reduce(
        (total, caisse) => total + Number(caisse.solde),
        0
    );

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            <KpiCard
                title="Solde total"
                value={soldeTotal}
                color="primary"
            />

            <KpiCard
                title="Entrées du mois"
                value={stats.entrees_mois}
                color="success"
            />

            <KpiCard
                title="Sorties du mois"
                value={stats.sorties_mois}
                color="warning"
            />

        </div>

    );

}