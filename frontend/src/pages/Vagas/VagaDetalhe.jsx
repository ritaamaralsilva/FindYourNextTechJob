import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  rotulosArea,
  rotulosSenioridade,
  rotulosRegime,
} from "../../constants/filtros";
import { ComponentButton } from "../../components/componentButton/ComponentButton";
import "./VagaDetalhe.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function formatarSalario(min, max, moeda = "EUR") {
  if (!min && !max) return null;
  if (min && max) return `${min} - ${max} ${moeda}`;
  return `${min || max}+ ${moeda}`;
}

function formatarData(dataPost) {
  if (!dataPost) return null;
  return new Date(dataPost).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VagaDetalhe() {
  const { id } = useParams();
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);

    fetch(`${API_URL}/api/vagas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Vaga não encontrada");
        return res.json();
      })
      .then((data) => setVaga(data.vaga))
      .catch(() => setErro("Não foi possível encontrar esta vaga."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="vaga-detalhe-estado">A carregar vaga...</p>;
  }

  if (erro || !vaga) {
    return (
      <div className="vaga-detalhe-erro-container">
        <p className="vaga-detalhe-estado">{erro}</p>
        <Link to="/" className="vaga-detalhe-voltar">
          ← Voltar às vagas
        </Link>
      </div>
    );
  }

  const salario = formatarSalario(
    vaga.salario_min,
    vaga.salario_max,
    vaga.moeda
  );
  const tecnologias = vaga.tecnologias
    ? vaga.tecnologias.split(",").map((t) => t.trim())
    : [];

  function abrirVagaOriginal() {
    window.open(vaga.url_original, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="vaga-detalhe">
      <Link to="/" className="vaga-detalhe-voltar">
        ← Voltar às vagas
      </Link>

      <div className="vaga-detalhe-card">
        <div className="vaga-detalhe-badges">
          <span className={`vaga-badge vaga-badge-${vaga.regime}`}>
            {rotulosRegime[vaga.regime] || vaga.regime}
          </span>
          {vaga.senioridade && (
            <span className="vaga-badge vaga-badge-senioridade">
              {rotulosSenioridade[vaga.senioridade] || vaga.senioridade}
            </span>
          )}
          {vaga.area && (
            <span className="vaga-badge vaga-badge-area">
              {rotulosArea[vaga.area] || vaga.area}
            </span>
          )}
        </div>

        <h1 className="vaga-detalhe-titulo">{vaga.titulo}</h1>
        <p className="vaga-detalhe-empresa">{vaga.empresa}</p>

        <div className="vaga-detalhe-info-grid">
          {vaga.localizacao && (
            <div className="vaga-detalhe-info-item">
              <span className="vaga-detalhe-info-label">📍 Localização</span>
              <span>{vaga.localizacao}</span>
            </div>
          )}
          {salario && (
            <div className="vaga-detalhe-info-item">
              <span className="vaga-detalhe-info-label">💰 Salário</span>
              <span>{salario}</span>
            </div>
          )}
          {vaga.data_post && (
            <div className="vaga-detalhe-info-item">
              <span className="vaga-detalhe-info-label">🗓️ Publicada</span>
              <span>{formatarData(vaga.data_post)}</span>
            </div>
          )}
          <div className="vaga-detalhe-info-item">
            <span className="vaga-detalhe-info-label">🔗 Fonte</span>
            <span className="vaga-detalhe-fonte">{vaga.fonte}</span>
          </div>
        </div>

        {tecnologias.length > 0 && (
          <div className="vaga-detalhe-tecnologias">
            <h3>Tecnologias</h3>
            <div className="vaga-tags">
              {tecnologias.map((tech) => (
                <span key={tech} className="vaga-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {vaga.descricao && (
          <div className="vaga-detalhe-descricao">
            <h3>Descrição</h3>
            <p>{vaga.descricao}</p>
          </div>
        )}

        <ComponentButton
          type="button"
          variant="cta"
          functionForClick={abrirVagaOriginal}
        >
          Candidatar-me →
        </ComponentButton>
      </div>
    </div>
  );
}
