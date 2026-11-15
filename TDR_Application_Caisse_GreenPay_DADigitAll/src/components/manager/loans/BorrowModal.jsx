import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";

import { fcfa } from "../../ui/DashboardKit";
import {
  heroInput,
  heroModal,
  heroPrimaryBtn,
  heroSelect,
} from "../../ui/styles";

// onSuccess(data) doit renvoyer une promesse : si elle échoue, le message
// d'erreur s'affiche dans la modale et celle-ci reste ouverte.
export default function BorrowModal({ isOpen, onClose, caisses, onSuccess }) {
  const [caissePreteuseId, setCaissePreteuseId] = useState("");
  const [caisseEmprunteuseId, setCaisseEmprunteuseId] = useState("");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!caissePreteuseId || !caisseEmprunteuseId) {
      setError("Veuillez sélectionner les deux caisses.");
      return;
    }

    if (caissePreteuseId === caisseEmprunteuseId) {
      setError(
        "La caisse prêteuse et la caisse emprunteuse doivent être différentes.",
      );
      return;
    }

    if (!montant || Number(montant) <= 0) {
      setError("Veuillez saisir un montant valide.");
      return;
    }

    if (!motif.trim()) {
      setError("Veuillez indiquer le motif de l'emprunt.");
      return;
    }

    try {
      setLoading(true);

      await onSuccess({
        caisse_preteuse_id: Number(caissePreteuseId),
        caisse_emprunteuse_id: Number(caisseEmprunteuseId),
        montant: Number(montant),
        motif: motif.trim(),
      });

      setCaissePreteuseId("");
      setCaisseEmprunteuseId("");
      setMontant("");
      setMotif("");
      setError("");

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible d'effectuer l'emprunt.",
      );
    } finally {
      setLoading(false);
    }
  }

  const items = (libelleSolde) =>
    caisses.map((caisse) => {
      const nom = caisse.entreprise?.nom ?? caisse.nom;
      return (
        <SelectItem
          key={String(caisse.id)}
          textValue={`Caisse ${nom} — Solde ${fcfa(caisse.solde)} FCFA`}
        >
          <div className="flex flex-col">
            <span className="font-medium">Caisse {nom}</span>
            <span className="text-xs text-muted">
              {libelleSolde} : {fcfa(caisse.solde)} FCFA
            </span>
          </div>
        </SelectItem>
      );
    });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={heroModal}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Nouvel emprunt inter-caisses</ModalHeader>

          <ModalBody className="gap-4">
            <p className="text-sm text-muted">
              Transférez des fonds d'une caisse vers une autre.
            </p>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            )}

            <Select
              label="Caisse prêteuse"
              placeholder="Sélectionner la caisse qui prête"
              variant="bordered"
              classNames={heroSelect}
              selectedKeys={
                caissePreteuseId
                  ? new Set([String(caissePreteuseId)])
                  : new Set()
              }
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setCaissePreteuseId(value || "");
              }}
            >
              {items("Solde")}
            </Select>

            <Select
              label="Caisse à approvisionner"
              placeholder="Sélectionner la caisse à approvisionner"
              variant="bordered"
              classNames={heroSelect}
              selectedKeys={
                caisseEmprunteuseId
                  ? new Set([String(caisseEmprunteuseId)])
                  : new Set()
              }
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setCaisseEmprunteuseId(value || "");
              }}
            >
              {items("Solde actuel")}
            </Select>

            <Input
              type="number"
              label="Montant"
              placeholder="Ex : 50000"
              variant="bordered"
              classNames={heroInput}
              value={montant}
              onValueChange={setMontant}
              min="1"
            />

            <Input
              label="Motif"
              placeholder="Ex : Approvisionnement de la caisse"
              variant="bordered"
              classNames={heroInput}
              value={motif}
              onValueChange={setMotif}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onClose} type="button">
              Annuler
            </Button>

            <Button
              className={heroPrimaryBtn}
              type="submit"
              isLoading={loading}
            >
              Enregistrer l'emprunt
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
