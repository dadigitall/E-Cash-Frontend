import { Chip } from "@heroui/react";

export default function RequestRow({ demande }) {

    function getColor() {

        switch (demande.statut) {

            case "en_attente":
                return "warning";

            case "validee":
                return "success";

            case "rejetee":
                return "danger";

            case "justifiee":
                return "primary";

            default:
                return "default";
        }

    }

    return (

        <div className="flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition">

            <div className="space-y-1">

                <div className="flex items-center gap-2">

                    <p className="font-semibold">
                        {demande.motif}
                    </p>

                    <Chip
                        size="sm"
                        variant="flat"
                    >
                        {demande.entreprise.nom}
                    </Chip>

                </div>

                <p className="text-sm text-gray-500">

                    {demande.user.name}

                </p>

            </div>

            <div className="flex items-center gap-6">

                <Chip
                    color={getColor()}
                    variant="flat"
                >
                    {demande.statut}
                </Chip>

                <p className="font-bold">

                    {Number(
                        demande.montant_estime
                    ).toLocaleString("fr-FR")} FCFA

                </p>

            </div>

        </div>

    );

}