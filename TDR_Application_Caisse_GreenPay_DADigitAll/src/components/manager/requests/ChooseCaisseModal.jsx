import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    RadioGroup,
    Radio,
} from "@heroui/react";

export default function ChooseCaisseModal({
    isOpen,
    onClose,
    demande,
    caisses,
    onConfirm,
}) {
    const [selectedCaisseId, setSelectedCaisseId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Réinitialise la sélection à chaque nouvelle demande / ouverture
    useEffect(() => {
        if (isOpen) {
            setSelectedCaisseId(null);
        }
    }, [isOpen, demande]);

    async function handleConfirm() {
        if (!selectedCaisseId) return;

        setLoading(true);
        try {
            await onConfirm(demande.id, selectedCaisseId);
        } finally {
            setLoading(false);
        }
    }

    if (!demande) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    Choisir la caisse
                </ModalHeader>

                <ModalBody>
                    <p className="text-gray-600 mb-2">
                        Montant demandé :{" "}
                        <span className="font-semibold">
                            {Number(demande.montant_estime).toLocaleString("fr-FR")} FCFA
                        </span>
                    </p>

                    <RadioGroup
                        value={selectedCaisseId ? String(selectedCaisseId) : ""}
                        onValueChange={(val) => setSelectedCaisseId(Number(val))}
                    >
                        {caisses.map((caisse) => {
                            const insuffisant =
                                Number(caisse.solde) < Number(demande.montant_estime);

                            return (
                                <Radio
                                    key={caisse.id}
                                    value={String(caisse.id)}
                                    isDisabled={insuffisant}
                                >
                                    <div className="flex justify-between w-full gap-4">
                                        <span>{caisse.nom}</span>
                                        <span
                                            className={
                                                insuffisant
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                            }
                                        >
                                            {Number(caisse.solde).toLocaleString("fr-FR")} FCFA
                                            {insuffisant && " (insuffisant)"}
                                        </span>
                                    </div>
                                </Radio>
                            );
                        })}
                    </RadioGroup>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Annuler
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={!selectedCaisseId}
                        isLoading={loading}
                        onPress={handleConfirm}
                    >
                        Confirmer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}