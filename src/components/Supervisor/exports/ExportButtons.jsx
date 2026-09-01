import api from "../../../services/api";
import { Button } from "@heroui/react";

export default function ExportButtons() {

    const exporterExcel = async () => {
        try {
            const response = await api.get(
                "/rapports/export/excel",
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }
                )
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `rapport-ekash-${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Erreur export Excel :",
                error
            );

        }
    };


    const exporterPdf = async () => {
        try {

            const response = await api.get(
                "/rapports/export/pdf",
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                )
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `rapport-ekash-${new Date()
                    .toISOString()
                    .slice(0, 10)}.pdf`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Erreur export PDF :",
                error
            );

        }
    };


    return (

        <div className="flex gap-3">

            <Button
                color="success"
                onPress={exporterExcel}
            >
                Excel
            </Button>

            <Button
                color="primary"
                onPress={exporterPdf}
            >
                PDF
            </Button>

        </div>

    );
}