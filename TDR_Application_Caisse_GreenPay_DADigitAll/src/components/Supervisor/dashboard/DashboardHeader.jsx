import ExportButtons from "../exports/ExportButtons";

export default function DashboardHeader() {
    return (
        <div className="flex justify-between items-center">

            <div>

                <h1 className="text-3xl font-bold">
                    Supervision financière
                </h1>

                <p className="text-gray-500 mt-1">
                    Vue consolidée · GreenPay & DA Digit All
                </p>

            </div>

        </div>
    );
}