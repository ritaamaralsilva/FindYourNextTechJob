import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthCard from "../../components/authCard/AuthCard";
import FormInput from "../../components/formInput/FormInput";
import { ComponentButton } from "../../components/componentButton/ComponentButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  async function submeterNovaPassword(event) {
    event.preventDefault();
    setErro(null);

    const formData = new FormData(event.target);
    const password = formData.get("password");
    const passwordConfirmation = formData.get("passwordConfirmation");

    if (password !== passwordConfirmation) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErro(data.erro || "Erro ao redefinir a password.");
        setLoading(false);
        return;
      }

      navigate("/login", {
        state: { message: "Password redefinida! Já podes entrar." },
      });
    } catch (err) {
      setErro("Erro ao contactar o servidor.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthCard title="Redefinir password">
        <p className="text-danger">Link inválido — falta o token.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Redefinir password">
      <form onSubmit={submeterNovaPassword}>
        <FormInput
          label="Nova password"
          name="password"
          type="password"
          required
          minLength={8}
        />
        <FormInput
          label="Confirma a nova password"
          name="passwordConfirmation"
          type="password"
          required
        />

        {!passwordMatch && (
          <p className="text-danger">As passwords não coincidem</p>
        )}
        {erro && <p className="text-danger">{erro}</p>}

        <ComponentButton
          type="submit"
          variant="refresh"
          loading={loading}
          disabled={loading}
        >
          Redefinir password
        </ComponentButton>
      </form>
    </AuthCard>
  );
}
