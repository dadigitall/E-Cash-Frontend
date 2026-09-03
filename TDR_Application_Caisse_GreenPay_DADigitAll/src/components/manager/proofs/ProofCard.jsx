export default function ProofCard({
    preuve,
    onValidate,
    onReject,
}) {

    const fichierUrl =
        `http://127.0.0.1:8000/storage/${preuve.chemin_fichier}`;

    return (

        <div className="border rounded-xl p-5 flex justify-between items-center">

            <div>

                <h3 className="font-semibold text-lg">
                    {preuve.demande.motif}
                </h3>

                <p className="text-gray-500 mt-1">
                    {preuve.demande.user.name}
                </p>

                <p className="text-sm text-gray-400">
                    {preuve.demande.entreprise.nom}
                </p>

                <p className="mt-3">
                    <span className="font-medium">
                        Montant déclaré :
                    </span>{" "}
                    {Number(preuve.montant_declare).toLocaleString("fr-FR")} FCFA
                </p>

            </div>

            <div className="flex gap-3">

                <a
                    href={fichierUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                    Voir
                </a>

                <button
                    onClick={() => onValidate(preuve.id)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white"
                >
                    Valider
                </button>

                <button
                    onClick={() => onReject(preuve.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white"
                >
                    Rejeter
                </button>

            </div>

        </div>

    );

}