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

export default function BorrowModal({
    isOpen,
    onClose,
    caisses,
    onSuccess,
}) {
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
                "La caisse prêteuse et la caisse emprunteuse doivent être différentes."
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

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Impossible d'effectuer l'emprunt."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
        >
            <ModalContent>
                <form onSubmit={handleSubmit}>

                    <ModalHeader>
                        Approvisionner une caisse
                    </ModalHeader>

                    <ModalBody className="space-y-4">

                        <p className="text-sm text-gray-500">
                            Transférez des fonds d'une caisse vers une autre.
                        </p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* CAISSE PRETEUSE */}
                        <Select
                            label="Caisse prêteuse"
                            placeholder="Sélectionner la caisse qui prête"
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
                            {caisses.map((caisse) => (
                                <SelectItem
                                    key={String(caisse.id)}
                                    textValue={`Caisse ${
                                        caisse.entreprise?.nom ?? caisse.nom
                                    } — Solde ${
                                        Number(caisse.solde).toLocaleString(
                                            "fr-FR"
                                        )
                                    } FCFA`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            Caisse{" "}
                                            {caisse.entreprise?.nom ??
                                                caisse.nom}
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            Solde :{" "}
                                            {Number(
                                                caisse.solde
                                            ).toLocaleString("fr-FR")}{" "}
                                            FCFA
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>

                        {/* CAISSE EMPRUNTEUSE */}
                        <Select
                            label="Caisse à approvisionner"
                            placeholder="Sélectionner la caisse à approvisionner"
                            selectedKeys={
                                caisseEmprunteuseId
                                    ? new Set([
                                          String(caisseEmprunteuseId),
                                      ])
                                    : new Set()
                            }
                            onSelectionChange={(keys) => {
                                const value = Array.from(keys)[0];
                                setCaisseEmprunteuseId(value || "");
                            }}
                        >
                            {caisses.map((caisse) => (
                                <SelectItem
                                    key={String(caisse.id)}
                                    textValue={`Caisse ${
                                        caisse.entreprise?.nom ?? caisse.nom
                                    } — Solde ${
                                        Number(caisse.solde).toLocaleString(
                                            "fr-FR"
                                        )
                                    } FCFA`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            Caisse{" "}
                                            {caisse.entreprise?.nom ??
                                                caisse.nom}
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            Solde actuel :{" "}
                                            {Number(
                                                caisse.solde
                                            ).toLocaleString("fr-FR")}{" "}
                                            FCFA
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            type="number"
                            label="Montant"
                            placeholder="Ex : 50000"
                            value={montant}
                            onValueChange={setMontant}
                            min="1"
                        />

                        <Input
                            label="Motif"
                            placeholder="Ex : Approvisionnement de la caisse"
                            value={motif}
                            onValueChange={setMotif}
                        />

                    </ModalBody>

                    <ModalFooter>

                        <Button
                            variant="light"
                            onPress={onClose}
                            type="button"
                        >
                            Annuler
                        </Button>

                        <Button
                            color="primary"
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