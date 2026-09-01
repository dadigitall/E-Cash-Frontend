import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
} from "@heroui/react";

export default function ValidateWithoutProofModal({
    isOpen,
    onClose,
    demande,
    onConfirm,
}) {
    const [commentaire, setCommentaire] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setCommentaire("");
            setError("");
        }
    }, [isOpen, demande]);

    async function handleSubmit() {
        setError("");

        if (!commentaire.trim()) {
            setError("Veuillez expliquer pourquoi vous validez sans preuve.");
            return;
        }

        setLoading(true);
        try {
            await onConfirm(demande.id, commentaire.trim());
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Une erreur est survenue lors de la validation."
            );
        } finally {
            setLoading(false);
        }
    }

    if (!demande) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    Valider sans preuve
                </ModalHeader>

                <ModalBody>
                    <p className="text-gray-600">
                        Demande de{" "}
                        <span className="font-semibold">
                            {demande.user?.name}
                        </span>{" "}
                        —{" "}
                        <span className="font-semibold">
                            {Number(demande.montant_estime).toLocaleString("fr-FR")} FCFA
                        </span>
                    </p>

                    <Textarea
                        label="Commentaire"
                        placeholder="Expliquez pourquoi cette demande est validée sans justificatif..."
                        value={commentaire}
                        onValueChange={setCommentaire}
                        minRows={3}
                    />

                    {error && (
                        <p className="text-sm text-danger">{error}</p>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Annuler
                    </Button>
                    <Button
                        color="primary"
                        isLoading={loading}
                        onPress={handleSubmit}
                    >
                        Valider
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}