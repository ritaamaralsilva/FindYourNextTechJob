import { useEffect, useState } from "react";
import FiltroPainel from "../../components/filtroPainel/FiltroPainel";
import VagaCard from "../../components/vagaCard/VagaCard";
import "./Homepage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Homepage() {
  const [filtros, setFiltros] = useState({});
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);

    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor) params.set(chave, valor);
    });
    params.set("porPagina", "all");

    fetch(`${API_URL}/api/vagas?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar vagas");
        return res.json();
      })
      .then((data) => setVagas(data.vagas))
      .catch(() =>
        setErro("Não foi possível carregar as vagas. Tenta novamente.")
      )
      .finally(() => setLoading(false));
  }, [filtros]);

  return (
    <div className="homepage">
      <div className="homepage-header">
        <h1 className="homepage-titulo">Encontra a tua próxima vaga tech</h1>
        <p className="homepage-subtitulo">
          Vagas de tecnologia em Portugal, todas num só sítio.
        </p>
      </div>

      <FiltroPainel filtros={filtros} onChange={setFiltros} />

      <div className="homepage-resultados">
        {loading && <p className="homepage-estado">A carregar vagas...</p>}

        {erro && <p className="homepage-estado homepage-erro">{erro}</p>}

        {!loading && !erro && vagas.length === 0 && (
          <p className="homepage-estado">
            Não encontrámos vagas com esses filtros. Tenta ajustar a pesquisa.
          </p>
        )}

        {!loading && !erro && vagas.length > 0 && (
          <>
            <p className="homepage-contagem">
              {vagas.length}{" "}
              {vagas.length === 1 ? "vaga encontrada" : "vagas encontradas"}
            </p>
            <div className="vagas-grid">
              {vagas.map((vaga) => (
                <VagaCard key={vaga.id} vaga={vaga} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
