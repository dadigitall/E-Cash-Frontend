import CashboxCard from "./cashboxes/CashboxCard";

export default function StatsCards({ caisses = [], totalCaisses }) {

    console.log("StatsCards :", caisses);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                Nombre de caisses : {totalCaisses ?? caisses.length}
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {caisses.map((caisse) => (
                    <CashboxCard
                        key={caisse.id}
                        caisse={caisse}
                    />
                ))}
            </div>
        </div>
    );
}