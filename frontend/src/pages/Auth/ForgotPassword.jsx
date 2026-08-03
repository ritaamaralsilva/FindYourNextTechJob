import { useState } from "react";
import AuthCard from "../../components/authCard/AuthCard";
import FormInput from "../../components/formInput/FormInput";
import { ComponentButton } from "../../components/componentButton/ComponentButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ForgotPassword() {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submeterPedido(event) {
    event.preventDefault();
    setErro(null);
    setLoading(true);

    const formData = new FormData(event.target);
    const email = formData.get("email");

    try {
      await fetch(`${API_URL}/api/auth/esqueci-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setEnviado(true);
    } catch (err) {
      setErro("Erro ao contactar o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Recuperar password">
      {enviado ? (
        <p className="text-success">
          Se esse email estiver registado, vais receber um link para redefinires
          a password.
        </p>
      ) : (
        <form onSubmit={submeterPedido}>
          <FormInput label="Email" name="email" type="email" required />

          {erro && <p className="text-danger">{erro}</p>}

          <ComponentButton
            type="submit"
            variant="refresh"
            loading={loading}
            disabled={loading}
          >
            Enviar link de recuperação
          </ComponentButton>
        </form>
      )}
    </AuthCard>
  );
}
