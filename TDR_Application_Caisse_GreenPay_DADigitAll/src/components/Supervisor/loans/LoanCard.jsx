import { Chip } from "@heroui/react";

export default function LoanCard({ emprunt }) {

    const caissePreteuse =
        emprunt?.caisse_preteuse ??
        emprunt?.caissePreteuse;

    const caisseEmprunteuse =
        emprunt?.caisse_emprunteuse ??
        emprunt?.caisseEmprunteuse;

    const nomCaissePreteuse =
        caissePreteuse?.nom ?? "Caisse inconnue";

    const nomCaisseEmprunteuse =
        caisseEmprunteuse?.nom ?? "Caisse inconnue";

    const estRembourse =
        emprunt?.statut === "rembourse";

    return (
        <div className="px-6 py-5">

            <div className="flex justify-between items-center">

                <div>

                    <p className="font-semibold">
                        {nomCaissePreteuse}
                    </p>

                    <p className="text-sm text-gray-500">
                        →
                        {" "}
                        {nomCaisseEmprunteuse}
                    </p>

                </div>

                <Chip
                    color={
                        estRembourse
                            ? "success"
                            : "warning"
                    }
                    variant="flat"
                >
                    {estRembourse
                        ? "Régularisé"
                        : "En cours"}
                </Chip>

            </div>

            <div className="mt-4 flex justify-between">

                <p className="font-bold">

                    {Number(
                        emprunt?.montant ?? 0
                    ).toLocaleString("fr-FR")}

                    {" "}FCFA

                </p>

                <p className="text-sm text-gray-500">

                    {emprunt?.date_emprunt
                        ? new Date(
                            emprunt.date_emprunt
                        ).toLocaleDateString("fr-FR")
                        : emprunt?.created_at
                            ? new Date(
                                emprunt.created_at
                            ).toLocaleDateString("fr-FR")
                            : "-"
                    }

                </p>

            </div>

        </div>
    );
}