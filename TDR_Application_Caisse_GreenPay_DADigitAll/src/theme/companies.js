// Les id (1 = GreenPay, 2 = DA Digit All) viennent de RegisterPage :
// à vérifier avec la table `entreprises` de la base.
export const COMPANIES = {
  gp: { key: "gp", id: 1, nom: "GreenPay", short: "GP" },
  da: { key: "da", id: 2, nom: "DA Digit All", short: "DA" },
};

export function normaliser(texte) {
  return String(texte ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function companyFromName(nom) {
  // On retire espaces, tirets et underscores : "green-pay", "Green Pay"
  // et "GreenPay" sont reconnus de la même façon.
  const n = normaliser(nom).replace(/[^a-z0-9]/g, "");
  if (n.includes("greenpay")) return "gp";
  if (n.includes("dadigitall")) return "da";
  return null;
}

// Retourne "gp" | "da" | "neutral"
export function resolveCompany(user) {
  if (!user) return "neutral";

  const e = user.entreprise;
  const nom = typeof e === "string" ? e : (e?.nom ?? user.entreprise_nom);

  const parNom = companyFromName(nom);
  if (parNom) return parNom;

  const id = Number(user.entreprise_id ?? e?.id);
  const parId = Object.values(COMPANIES).find((c) => c.id === id);
  return parId?.key ?? "neutral";
}
