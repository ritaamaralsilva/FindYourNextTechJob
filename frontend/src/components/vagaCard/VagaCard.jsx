import { Link } from "react-router-dom";
import { rotulosSenioridade, rotulosRegime } from "../../constants/filtros";
import "./VagaCard.css";

function formatarSalario(min, max, moeda = "EUR") {
  if (!min && !max) return null;
  if (min && max) return `${min} - ${max} ${moeda}`;
  return `${min || max}+ ${moeda}`;
}

function formatarData(dataPost) {
  if (!dataPost) return null;
  const dias = Math.floor(
    (Date.now() - new Date(dataPost)) / (1000 * 60 * 60 * 24)
  );
  if (dias === 0) return "Hoje";
  if (dias === 1) return "Ontem";
  return `Há ${dias} dias`;
}

export default function VagaCard({ vaga }) {
  const {
    id,
    titulo,
    empresa,
    fonte,
    data_post,
    area,
    senioridade,
    salario_min,
    salario_max,
    moeda,
    regime,
    localizacao,
    tecnologias,
  } = vaga;

  const salario = formatarSalario(salario_min, salario_max, moeda);
  const tecnologiasArray = tecnologias
    ? tecnologias.split(",").map((t) => t.trim())
    : [];

  return (
    <Link to={`/vagas/${id}`} className="vaga-card">
      <div className="vaga-card-topo">
        <span className={`vaga-badge vaga-badge-${regime}`}>
          {rotulosRegime[regime] || regime}
        </span>
        {senioridade && (
          <span className="vaga-badge vaga-badge-senioridade">
            {rotulosSenioridade[senioridade] || senioridade}
          </span>
        )}
      </div>

      <h3 className="vaga-titulo">{titulo}</h3>
      <p className="vaga-empresa">{empresa}</p>

      <div className="vaga-info-linha">
        {localizacao && (
          <span className="vaga-info-item">📍 {localizacao}</span>
        )}
        {salario && <span className="vaga-info-item">💰 {salario}</span>}
      </div>

      {tecnologiasArray.length > 0 && (
        <div className="vaga-tags">
          {tecnologiasArray.slice(0, 5).map((tech) => (
            <span key={tech} className="vaga-tag">
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="vaga-card-rodape">
        <span className="vaga-fonte">via {fonte}</span>
        {data_post && (
          <span className="vaga-data">{formatarData(data_post)}</span>
        )}
      </div>
    </Link>
  );
}
