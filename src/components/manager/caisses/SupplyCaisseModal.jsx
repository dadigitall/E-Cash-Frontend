import { useState, useEffect } from "react";
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

export default function SupplyCaisseModal({
  isOpen,
  onClose,
  caisses,
  onSuccess,
}) {
  const [selectedCaisseId, setSelectedCaisseId] = useState("");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [compteBancaire, setCompteBancaire] = useState("");
  const [modeReglement, setModeReglement] = useState("");
  const [numeroCheque, setNumeroCheque] = useState("");
  const [deposePar, setDeposePar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedCaisseId("");
      setMontant("");
      setMotif("");
      setSourceType("");
      setCompteBancaire("");
      setModeReglement("");
      setNumeroCheque("");
      setDeposePar("");
      setError("");
    }
  }, [isOpen]);

  const selectedCaisse = caisses.find(
    (c) => String(c.id) === String(selectedCaisseId),
  );

  async function handleSubmit() {
    setError("");

    if (!selectedCaisseId) {
      setError("Veuillez choisir une caisse.");
      return;
    }
    if (!montant || Number(montant) <= 0) {
      setError("Veuillez indiquer un montant valide.");
      return;
    }
    if (!sourceType) {
      setError("Veuillez préciser la nature de la source.");
      return;
    }
    if (sourceType === "directe" && !compteBancaire) {
      setError("Veuillez indiquer le compte bancaire.");
      return;
    }
    if (sourceType === "indirecte" && !modeReglement) {
      setError("Veuillez préciser le mode de règlement.");
      return;
    }
    if (modeReglement === "cheque" && !numeroCheque) {
      setError("Veuillez indiquer le numéro de chèque.");
      return;
    }
    if (modeReglement === "espece" && !deposePar) {
      setError("Veuillez indiquer le nom du déposant.");
      return;
    }

    const donnees = {
      montant: Number(montant),
      motif: motif || undefined,
      source_type: sourceType,
      ...(sourceType === "directe" && { compte_bancaire: compteBancaire }),
      ...(sourceType === "indirecte" && {
        mode_reglement: modeReglement,
        ...(modeReglement === "cheque" && { numero_cheque: numeroCheque }),
        ...(modeReglement === "espece" && { depose_par: deposePar }),
      }),
    };

    setLoading(true);
    try {
      await onSuccess(selectedCaisseId, donnees);
      setSelectedCaisseId("");
      setMontant("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'approvisionnement.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Approvisionner une caisse</ModalHeader>

        <ModalBody>
          <Select
            label="Caisse"
            selectedKeys={selectedCaisseId ? [String(selectedCaisseId)] : []}
            onSelectionChange={(keys) =>
              setSelectedCaisseId(Array.from(keys)[0] ?? "")
            }
          >
            {caisses.map((caisse) => (
              <SelectItem key={String(caisse.id)} value={String(caisse.id)}>
                {caisse.nom}
              </SelectItem>
            ))}
          </Select>

          {selectedCaisse && (
            <p className="text-gray-600">
              Solde actuel :{" "}
              <span className="font-semibold">
                {Number(selectedCaisse.solde).toLocaleString("fr-FR")} FCFA
              </span>
            </p>
          )}

          <Input
            label="Montant à ajouter"
            type="number"
            value={montant}
            onValueChange={setMontant}
          />

          <Input
            label="Motif (optionnel)"
            value={motif}
            onValueChange={setMotif}
          />

          <Select
            label="Nature de la source"
            selectedKeys={sourceType ? [sourceType] : []}
            onSelectionChange={(keys) => {
              setSourceType(Array.from(keys)[0] ?? "");
              setModeReglement("");
              setNumeroCheque("");
              setDeposePar("");
              setCompteBancaire("");
            }}
          >
            <SelectItem key="directe" value="directe">
              Directe (depuis la banque)
            </SelectItem>
            <SelectItem key="indirecte" value="indirecte">
              Indirecte (venant du personnel)
            </SelectItem>
          </Select>

          {sourceType === "directe" && (
            <Input
              label="Compte bancaire"
              value={compteBancaire}
              onValueChange={setCompteBancaire}
            />
          )}

          {sourceType === "indirecte" && (
            <Select
              label="Mode de règlement"
              selectedKeys={modeReglement ? [modeReglement] : []}
              onSelectionChange={(keys) => {
                setModeReglement(Array.from(keys)[0] ?? "");
                setNumeroCheque("");
                setDeposePar("");
              }}
            >
              <SelectItem key="cheque" value="cheque">
                Chèque
              </SelectItem>
              <SelectItem key="espece" value="espece">
                Espèces
              </SelectItem>
            </Select>
          )}

          {modeReglement === "cheque" && (
            <Input
              label="Numéro de chèque"
              value={numeroCheque}
              onValueChange={setNumeroCheque}
            />
          )}

          {modeReglement === "espece" && (
            <Input
              label="Déposé par (nom du DG)"
              value={deposePar}
              onValueChange={setDeposePar}
            />
          )}

          {selectedCaisse && montant && Number(montant) > 0 && (
            <p className="text-sm text-gray-500">
              Nouveau solde :{" "}
              <span className="font-semibold text-green-600">
                {(
                  Number(selectedCaisse.solde) + Number(montant)
                ).toLocaleString("fr-FR")}{" "}
                FCFA
              </span>
            </p>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button color="secondary" isLoading={loading} onPress={handleSubmit}>
            Approvisionner
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
