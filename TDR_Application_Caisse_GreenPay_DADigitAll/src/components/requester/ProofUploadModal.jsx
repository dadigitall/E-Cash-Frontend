import { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button,
} from "@heroui/react";

import api from "../../services/api";

export default function ProofUploadModal({
    isOpen,
    onClose,
    request,
    onSuccess,
}) {

    const [montant, setMontant] = useState("");
    const [preuve, setPreuve] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!isOpen) {
            setMontant("");
            setPreuve(null);
            setError("");
        }

    }, [isOpen]);

    async function handleSubmit() {

        if (!montant) {
            setError("Veuillez saisir le montant réel.");
            return;
        }

        if (!preuve) {
            setError("Veuillez choisir un justificatif.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("montant_reel", montant);
            formData.append("preuve", preuve);

            await api.post(
                `/demandes/${request.id}/preuve`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            onSuccess();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ??
                "Une erreur est survenue."
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
            backdrop="blur"
            size="md"
        >

            <ModalContent className="bg-white">

                <ModalHeader>

                    Déposer une preuve

                </ModalHeader>

                <ModalBody className="space-y-5">

                    <Input
                        type="number"
                        value={montant}
                        onValueChange={setMontant}
                    />

                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {

                            if (e.target.files.length > 0) {
                                setPreuve(e.target.files[0]);
                            }

                        }}
                        className="block w-full text-sm
                        file:mr-4
                        file:px-4
                        file:py-2
                        file:rounded-lg
                        file:border-0
                        file:bg-blue-600
                        file:text-white
                        file:cursor-pointer
                        cursor-pointer"
                    />

                    {preuve && (

                        <div className="rounded-lg bg-gray-100 p-3 text-sm">

                            📎 {preuve.name}

                        </div>

                    )}

                    {error && (

                        <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-red-600 text-sm">

                            {error}

                        </div>

                    )}

                </ModalBody>

                <ModalFooter>

                    <Button
                        variant="light"
                        onPress={onClose}
                    >
                        Annuler
                    </Button>

                    <Button
                        color="primary"
                        isLoading={loading}
                        onPress={handleSubmit}
                    >
                        Envoyer la preuve
                    </Button>

                </ModalFooter>

            </ModalContent>

        </Modal>

    );

}