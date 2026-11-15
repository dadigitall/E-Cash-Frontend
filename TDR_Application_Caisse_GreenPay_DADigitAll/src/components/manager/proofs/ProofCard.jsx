export default function ProofCard({ preuve, onValidate, onReject, onView }) {
  const demande = preuve.demande ?? {};
  const montant = Number(preuve.montant_declare ?? 0).toLocaleString("fr-FR");

  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0">
        <h3 className="break-words text-lg font-semibold">{demande.motif}</h3>

        <p className="mt-1 text-gray-500">{demande.user?.name}</p>

        <p className="text-sm text-gray-400">{demande.entreprise?.nom}</p>

        <p className="mt-3">
          <span className="font-medium">Montant déclaré :</span>
          {` ${montant} FCFA`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onView?.(preuve)}
          className="flex-1 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 sm:flex-none"
        >
          Voir
        </button>

        <button
          type="button"
          onClick={() => onValidate(preuve.id)}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white sm:flex-none"
        >
          Valider
        </button>

        <button
          type="button"
          onClick={() => onReject(preuve.id)}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white sm:flex-none"
        >
          Rejeter
        </button>
      </div>
    </div>
  );
}
