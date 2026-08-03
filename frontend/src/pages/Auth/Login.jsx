import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AuthCard from "../../components/authCard/AuthCard";
import FormInput from "../../components/formInput/FormInput";
import { ComponentButton } from "../../components/componentButton/ComponentButton";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const mensagemRegisto = location.state?.message;

  async function submeterLogin(event) {
    event.preventDefault();
    setErro(null);
    setLoading(true);

    const formData = new FormData(event.target);
    const authData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const sucesso = await login(authData);
    setLoading(false);

    if (sucesso) {
      navigate("/");
    } else {
      setErro("Email ou password incorretos.");
    }
  }

  return (
    <AuthCard title="Login">
      {mensagemRegisto && <p className="text-success">{mensagemRegisto}</p>}

      <form onSubmit={submeterLogin}>
        <FormInput label="Email" name="email" type="email" required />
        <FormInput label="Password" name="password" type="password" required />

        {erro && <p className="text-danger">{erro}</p>}

        <ComponentButton
          type="submit"
          functionForClick={undefined}
          variant="refresh"
          loading={loading}
          disabled={loading}
        >
          Entrar
        </ComponentButton>

        <p className="auth-link">
          <a href="/esqueci-a-password">Esqueceste-te da password?</a>
        </p>
      </form>
    </AuthCard>
  );
}
