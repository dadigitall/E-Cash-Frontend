import { Field, inputClass } from "../auth/AuthShell";

// Conservé pour compatibilité avec d'éventuels anciens imports
export const POSTE_AUTRE = "autre";

/*
  Liste déroulante des postes. « Autre » vient de l'API (slug "autre") ;
  le champ « Précisez le poste » s'affiche quand il est sélectionné.
  onChange reçoit { poste_id, poste_autre }.
*/
export default function PosteSelect({
  postes = [],
  posteId,
  posteAutre,
  onChange,
  error,
  errorAutre,
}) {
  const choisi = postes.find((p) => String(p.id) === String(posteId));
  const estAutre = choisi?.slug === "autre";

  return (
    <div className="space-y-5">
      <Field label="Poste" error={error}>
        <select
          value={posteId ?? ""}
          onChange={(e) =>
            onChange({ poste_id: e.target.value, poste_autre: "" })
          }
          className={inputClass}
        >
          <option value="">Choisir...</option>
          {postes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
      </Field>

      {/* Conteneur toujours présent : évite les erreurs de DOM */}
      <div>
        {estAutre && (
          <Field label="Précisez le poste" error={errorAutre}>
            <input
              value={posteAutre ?? ""}
              maxLength={100}
              placeholder="Ex : Chauffeur"
              onChange={(e) =>
                onChange({ poste_id: posteId, poste_autre: e.target.value })
              }
              className={inputClass}
            />
          </Field>
        )}
      </div>
    </div>
  );
}
