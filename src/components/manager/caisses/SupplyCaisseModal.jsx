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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setSelectedCaisseId("");
            setMontant("");
            setError("");
        }
    }, [isOpen]);

    const selectedCaisse = caisses.find(
        (c) => String(c.id) === String(selectedCaisseId)
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

        setLoading(true);
        try {
            await onSuccess(selectedCaisseId, Number(montant));
            setSelectedCaisseId("");
            setMontant("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Une erreur est survenue lors de l'approvisionnement."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    Approvisionner une caisse
                </ModalHeader>

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

                    {error && (
                        <p className="text-sm text-danger">{error}</p>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Annuler
                    </Button>
                    <Button
                        color="secondary"
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