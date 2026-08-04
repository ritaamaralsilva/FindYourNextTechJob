import { useEffect, useState } from "react";
import {
  rotulosArea,
  rotulosSenioridade,
  rotulosRegime,
  ordemArea,
  ordemSenioridade,
  ordemRegime,
} from "../../constants/filtros";
import "./FiltroPainel.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function FiltroPainel({ filtros, onChange }) {
  const [opcoes, setOpcoes] = useState({ areas: [], cidades: [] });

  useEffect(() => {
    fetch(`${API_URL}/api/vagas/opcoes-filtro`)
      .then((res) => res.json())
      .then(setOpcoes)
      .catch((err) => console.error("Erro ao carregar filtros", err));
  }, []);

  function atualizarFiltro(campo, valor) {
    onChange({ ...filtros, [campo]: valor });
  }

  // só mostra no select as áreas que existem mesmo na BD, na ordem fixa definida
  const areasDisponiveis = ordemArea.filter((area) =>
    opcoes.areas.includes(area)
  );

  return (
    <div className="filtro-painel">
      <div className="filtro-campo">
        <label htmlFor="filtro-area">Área</label>
        <select
          id="filtro-area"
          value={filtros.area || ""}
          onChange={(e) => atualizarFiltro("area", e.target.value)}
        >
          <option value="">Todas as áreas</option>
          {areasDisponiveis.map((area) => (
            <option key={area} value={area}>
              {rotulosArea[area] || area}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-campo">
        <label htmlFor="filtro-stack">Tecnologia / Stack</label>
        <input
          id="filtro-stack"
          type="text"
          placeholder="ex.: React, Node.js..."
          value={filtros.stack || ""}
          onChange={(e) => atualizarFiltro("stack", e.target.value)}
        />
      </div>

      <div className="filtro-campo">
        <label htmlFor="filtro-cidade">Cidade</label>
        <input
          id="filtro-cidade"
          type="text"
          placeholder="ex.: Porto, Lisboa..."
          value={filtros.cidade || ""}
          onChange={(e) => atualizarFiltro("cidade", e.target.value)}
        />
      </div>

      <div className="filtro-campo">
        <label htmlFor="filtro-regime">Regime</label>
        <select
          id="filtro-regime"
          value={filtros.regime || ""}
          onChange={(e) => atualizarFiltro("regime", e.target.value)}
        >
          <option value="">Todos os regimes</option>
          {ordemRegime.map((regime) => (
            <option key={regime} value={regime}>
              {rotulosRegime[regime]}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-campo">
        <label htmlFor="filtro-senioridade">Senioridade</label>
        <select
          id="filtro-senioridade"
          value={filtros.senioridade || ""}
          onChange={(e) => atualizarFiltro("senioridade", e.target.value)}
        >
          <option value="">Todas</option>
          {ordemSenioridade.map((nivel) => (
            <option key={nivel} value={nivel}>
              {rotulosSenioridade[nivel]}
            </option>
          ))}
        </select>
      </div>
      <div className="filtro-campo">
        <label htmlFor="filtro-data">Data de publicação</label>
        <select
          id="filtro-data"
          value={filtros.data || ""}
          onChange={(e) => atualizarFiltro("data", e.target.value)}
        >
          <option value="">Qualquer altura</option>
          <option value="24h">Últimas 24 horas</option>
          <option value="semana">Última semana</option>
          <option value="mes">Último mês</option>
        </select>
      </div>

      <div className="filtro-campo">
        <label htmlFor="filtro-ordenar">Ordenar por</label>
        <select
          id="filtro-ordenar"
          value={filtros.ordenar || "recente"}
          onChange={(e) => atualizarFiltro("ordenar", e.target.value)}
        >
          <option value="recente">Mais recentes primeiro</option>
          <option value="antiga">Mais antigas primeiro</option>
        </select>
      </div>
    </div>
  );
}
