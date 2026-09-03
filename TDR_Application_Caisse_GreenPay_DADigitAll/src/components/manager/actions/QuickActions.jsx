import { Button } from "@heroui/react";

export default function QuickActions({ onBorrow, onSupply }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Actions rapides
            </h2>

            <div className="flex gap-4">
                <Button
                    color="primary"
                    onPress={onBorrow}
                >
                    Emprunt
                </Button>

                <Button color="secondary" onPress={onSupply}>
                    Approvisionner une caisse
                </Button>
            </div>
        </div>
    );
}