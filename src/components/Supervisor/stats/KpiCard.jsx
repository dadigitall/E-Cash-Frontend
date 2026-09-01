import { Card, CardBody } from "@heroui/react";

export default function KpiCard({

    title,

    value,

}) {

    return (

        <Card shadow="sm">

            <CardBody className="space-y-2">

                <p className="text-sm text-gray-500">

                    {title}

                </p>

                <h2 className="text-2xl font-bold">

                    {Number(value ?? 0).toLocaleString("fr-FR")} FCFA

                </h2>

            </CardBody>

        </Card>

    );

}