import { useEffect, useState } from "react";

const cle = (userId) => `ecash:acceptees-vues:${userId ?? "anon"}`;

function lire(userId) {
  try {
    return new Set(JSON.parse(localStorage.getItem(cle(userId)) ?? "[]"));
  } catch {
    return new Set();
  }
}

function ecrire(userId, ensemble) {
  try {
    localStorage.setItem(
      cle(userId),
      JSON.stringify([...ensemble].slice(-100)),
    );
  } catch {
    // stockage indisponible : l'animation pourra se rejouer, sans conséquence
  }
}

/*
  Quand l'employé arrive sur sa page et qu'une demande « acceptee » n'a pas
  encore été fêtée, renvoie un événement pour <MoneyFlow />.
  L'id de chaque demande est mémorisé : l'animation ne joue qu'une fois
  par demande et par navigateur.

  Retourne [event, clear].
*/
export function useAcceptedCelebration(requests, userId) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!requests?.length) return;

    const vues = lire(userId);
    const nouvelles = requests.filter(
      (r) => r.statut === "acceptee" && !vues.has(String(r.id)),
    );
    if (nouvelles.length === 0) return;

    nouvelles.forEach((r) => vues.add(String(r.id)));
    ecrire(userId, vues);

    setEvent({
      id: Date.now(),
      direction: "in",
      amount: nouvelles.reduce((t, r) => t + Number(r.montant ?? 0), 0),
      label:
        nouvelles.length > 1
          ? "Vos demandes ont été acceptées"
          : "Votre demande a été acceptée",
    });
  }, [requests, userId]);

  return [event, () => setEvent(null)];
}
