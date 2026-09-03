export default function NewRequestButton({ onClick }) {

    return (

        <button
            onClick={onClick}
            className="mb-8 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >

            + Nouvelle demande

        </button>

    );

}