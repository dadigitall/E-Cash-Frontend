import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [entreprises, setEntreprises] = useState([]);
  const [postes, setPostes] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone_whatsapp: "",
    password: "",
    password_confirmation: "",
    entreprise_id: "",
    poste_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    // Pour le moment (en attendant les routes API)

    setEntreprises([
      { id: 1, nom: "GreenPay" },
      { id: 2, nom: "DA Digit All" },
    ]);

    setPostes([
    { id: 1, nom: "Assistante de direction" },
    { id: 2, nom: "Commercial" },
    { id: 3, nom: "Technicien" },
    { id: 4, nom: "Comptable" },
    { id: 5, nom: "Développeur frontend" },
    { id: 6, nom: "Développeur fullstack" },
    { id: 7, nom: "Directeur Général" },
  ]);

  }, []);

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }

  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);
    setErrors({});

    try {

      const response = await api.post("/register", form);

      login(response.data);

      navigate("/dashboard");

    } catch (error) {

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Inscription
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label>Nom</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <p className="text-red-500 text-sm">
              {errors.name}
            </p>

          </div>

          <div>

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <p className="text-red-500 text-sm">
              {errors.email}
            </p>

          </div>

          <div>

            <label>Téléphone WhatsApp</label>

            <input
              name="telephone_whatsapp"
              value={form.telephone_whatsapp}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <p className="text-red-500 text-sm">
              {errors.telephone_whatsapp}
            </p>

          </div>

          <div>

            <label>Entreprise</label>

            <select
              name="entreprise_id"
              value={form.entreprise_id}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >

              <option value="">
                Choisir...
              </option>

              {entreprises.map((e) => (

                <option
                  key={e.id}
                  value={e.id}
                >
                  {e.nom}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label>Poste</label>

            <select
              name="poste_id"
              value={form.poste_id}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >

              <option value="">
                Choisir...
              </option>

              {postes.map((p) => (

                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.nom}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label>Mot de passe</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label>Confirmation</label>

            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-3"
          >
            {loading ? "Inscription..." : "Créer le compte"}
          </button>

        </form>

        <p className="text-center mt-5">

          Déjà un compte ?

          <Link
            to="/"
            className="text-blue-600 ml-2"
          >
            Se connecter
          </Link>

        </p>

      </div>

    </div>

  );

}