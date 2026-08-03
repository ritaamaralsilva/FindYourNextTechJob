import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AuthCard from "../../components/authCard/AuthCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState("a-verificar");
  const jaChamou = useRef(false);

  useEffect(() => {
    if (jaChamou.current) return;
    jaChamou.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setEstado("erro");
      return;
    }

    fetch(`${API_URL}/api/auth/verificar-email?token=${token}`)
      .then((res) => setEstado(res.ok ? "sucesso" : "erro"))
      .catch(() => setEstado("erro"));
  }, [searchParams]);

  return (
    <AuthCard title="Verificação de email">
      {estado === "a-verificar" && <p>A verificar...</p>}
      {estado === "sucesso" && (
        <>
          <p className="text-success">Email verificado! Já podes entrar.</p>
          <Link to="/login">Ir para o login</Link>
        </>
      )}
      {estado === "erro" && (
        <p className="text-danger">Link inválido ou expirado.</p>
      )}
    </AuthCard>
  );
}
