import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../../components/authCard/AuthCard";
import FormInput from "../../components/formInput/FormInput";
import { ComponentButton } from "../../components/componentButton/ComponentButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Signup() {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function registarUtilizador(event) {
    event.preventDefault();
    setErro(null);

    const formData = new FormData(event.target);
    const nome = formData.get("nome");
    const email = formData.get("email");
    const telefone = formData.get("telefone");
    const password = formData.get("password");
    const passwordConfirmation = formData.get("passwordConfirmation");

    if (password !== passwordConfirmation) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/registo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErro(data.erro || "Erro no registo.");
        setLoading(false);
        return;
      }

      navigate("/login", {
        state: {
          message: "Registo efetuado! Confirma o teu email antes de entrares.",
        },
      });
    } catch (err) {
      setErro("Erro ao contactar o servidor.");
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Registo">
      <form onSubmit={registarUtilizador}>
        <FormInput label="Nome" name="nome" required />
        <FormInput label="Email" name="email" type="email" required />
        <FormInput label="Telefone" name="telefone" type="tel" />
        <FormInput
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
        />
        <FormInput
          label="Confirme a Password"
          name="passwordConfirmation"
          type="password"
          required
        />

        {!passwordMatch && (
          <p className="text-danger">As passwords não coincidem</p>
        )}
        {erro && <p className="text-danger">{erro}</p>}

        <div className="mb-3 form-check">
          <input
            name="terms"
            required
            type="checkbox"
            className="form-check-input"
            id="termsCheck"
          />
          <label className="form-check-label" htmlFor="termsCheck">
            Aceito os termos e condições
          </label>
        </div>

        <ComponentButton
          type="submit"
          variant="refresh"
          loading={loading}
          disabled={loading}
        >
          Criar Conta
        </ComponentButton>
      </form>
    </AuthCard>
  );
}
