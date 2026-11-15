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

import { CompanyLogo, fcfa } from "../../ui/DashboardKit";
import {
  heroInput,
  heroModal,
  heroPrimaryBtn,
  heroSelect,
} from "../../ui/styles";
import { companyFromName } from "../../../theme/companies";

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
  const selectedKey = selectedCaisse
    ? companyFromName(selectedCaisse.entreprise?.nom ?? selectedCaisse.nom)
    : null;

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
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      scrollBehavior="inside"
      classNames={heroModal}
    >
      <ModalContent>
        <ModalHeader>Approvisionner une caisse</ModalHeader>

        <ModalBody className="gap-4">
          <Select
            label="Caisse"
            variant="bordered"
            classNames={heroSelect}
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
            <div
              data-company={selectedKey ?? undefined}
              className="flex items-center gap-3 rounded-2xl bg-brand-soft p-3"
            >
              {selectedKey && (
                <CompanyLogo companyKey={selectedKey} size={40} />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {selectedCaisse.nom}
                </p>
                <p className="text-sm text-muted">Solde actuel</p>
              </div>
              <p className="font-bold tabular-nums text-brand-deep">
                {fcfa(selectedCaisse.solde)} FCFA
              </p>
            </div>
          )}

          <Input
            label="Montant à ajouter"
            type="number"
            variant="bordered"
            classNames={heroInput}
            value={montant}
            onValueChange={setMontant}
          />

          <Input
            label="Motif (optionnel)"
            variant="bordered"
            classNames={heroInput}
            value={motif}
            onValueChange={setMotif}
          />

          <Select
            label="Nature de la source"
            variant="bordered"
            classNames={heroSelect}
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
              variant="bordered"
              classNames={heroInput}
              value={compteBancaire}
              onValueChange={setCompteBancaire}
            />
          )}

          {sourceType === "indirecte" && (
            <Select
              label="Mode de règlement"
              variant="bordered"
              classNames={heroSelect}
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
              variant="bordered"
              classNames={heroInput}
              value={numeroCheque}
              onValueChange={setNumeroCheque}
            />
          )}

          {modeReglement === "espece" && (
            <Input
              label="Déposé par (nom du DG)"
              variant="bordered"
              classNames={heroInput}
              value={deposePar}
              onValueChange={setDeposePar}
            />
          )}

          {selectedCaisse && montant && Number(montant) > 0 && (
            <p className="text-sm text-muted">
              Nouveau solde :{" "}
              <span className="font-semibold text-brand">
                {fcfa(Number(selectedCaisse.solde) + Number(montant))} FCFA
              </span>
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button
            className={heroPrimaryBtn}
            isLoading={loading}
            onPress={handleSubmit}
          >
            Approvisionner
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
