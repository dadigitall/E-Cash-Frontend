import {
    Card,
    CardBody,
    Select,
    SelectItem,
} from "@heroui/react";

export default function DashboardFilters({

    entreprise,
    setEntreprise,

    periode,
    setPeriode,

    employe,
    setEmploye,

    demandes,
    caisses,

}) {

    const entreprises = [
        "Toutes",
        ...new Set(
            caisses
                .filter((caisse) => caisse?.entreprise?.nom)
                .map((caisse) => caisse.entreprise.nom)
        ),
    ];

    const employes = [

        "Tous",

        ...new Set(
            demandes
                .filter((demande) => demande?.user?.name)
                .map((demande) => demande.user.name)
        ),

    ];

    const periodes = [

        "Aujourd'hui",
        "Cette semaine",
        "Ce mois",
        "Cette année",
        "Toutes",

    ];

    return (

        <Card shadow="sm">

            <CardBody className="space-y-5">

                <div>

                    <h2 className="text-lg font-semibold text-gray-800">

                        Filtres

                    </h2>

                    <p className="text-sm text-gray-500">

                        Filtrer les demandes par entreprise, période ou employé.

                    </p>

                </div>

                <div className="flex flex-wrap gap-5">

                    <Select

                        label="Entreprise"

                        placeholder="Toutes"

                        className="min-w-[240px] max-w-[280px]"

                        selectedKeys={[entreprise]}

                        onSelectionChange={(keys) =>
                            setEntreprise(Array.from(keys)[0])
                        }

                    >

                        {entreprises.map((item) => (

                            <SelectItem key={item}>

                                {item}

                            </SelectItem>

                        ))}

                    </Select>

                    <Select

                        label="Période"

                        placeholder="Toutes"

                        className="min-w-[240px] max-w-[280px]"

                        selectedKeys={[periode]}

                        onSelectionChange={(keys) =>
                            setPeriode(Array.from(keys)[0])
                        }

                    >

                        {periodes.map((item) => (

                            <SelectItem key={item}>

                                {item}

                            </SelectItem>

                        ))}

                    </Select>

                    <Select

                        label="Employé"

                        placeholder="Tous"

                        className="min-w-[240px] max-w-[280px]"

                        selectedKeys={[employe]}

                        onSelectionChange={(keys) =>
                            setEmploye(Array.from(keys)[0])
                        }

                    >

                        {employes.map((item) => (

                            <SelectItem key={item}>

                                {item}

                            </SelectItem>

                        ))}

                    </Select>

                </div>

            </CardBody>

        </Card>

    );

}