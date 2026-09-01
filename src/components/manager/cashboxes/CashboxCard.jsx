import { Card, CardBody } from "@heroui/react";

export default function CashboxCard({ caisse }) {

    return (

        <Card shadow="sm">

            <CardBody className="space-y-3">

                <h3 className="text-lg font-semibold">

                    {caisse.entreprise.nom}

                </h3>

                <p className="text-3xl font-bold">

                    {Number(caisse.solde).toLocaleString("fr-FR")} FCFA

                </p>

            </CardBody>

        </Card>

    );

}