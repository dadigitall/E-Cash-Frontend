import ProofCard from "./ProofCard";

export default function PendingProofs({
  preuves = [],
  onValidate,
  onReject,
  onView,
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Preuves à vérifier</h2>
        <p className="text-gray-500">
          Vérifiez les justificatifs déposés par les employés.
        </p>
      </div>

      {preuves.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Aucune preuve en attente.
        </div>
      ) : (
        <div className="space-y-4">
          {preuves.map((preuve) => (
            <ProofCard
              key={preuve.id}
              preuve={preuve}
              onValidate={onValidate}
              onReject={onReject}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
