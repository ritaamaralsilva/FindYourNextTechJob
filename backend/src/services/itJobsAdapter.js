const {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  extrairTecnologias,
} = require("./classificadores");

// mapeamento direto do workModel da ITJobs para o enum de regime
const REGIME_POR_WORK_MODEL = {
  0: "presencial",
  1: "remoto",
  2: "hibrido",
};

// contratos que indicam estágio, segundo o appendix da API
const CONTRATOS_ESTAGIO = [3, 5];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchVagasITJobs() {
  const apiKey = process.env.ITJOBS_API_KEY;
  const limit = 100;
  let pagina = 1;
  let total = null;
  const todasAsVagas = [];

  do {
    const url = new URL("https://api.itjobs.pt/job/list.json");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("limit", limit);
    url.searchParams.set("page", pagina);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro ITJobs (página ${pagina}):`, response.status);
      break;
    }

    const data = await response.json();
    total = data.total;
    todasAsVagas.push(...(data.results || []));

    pagina++;
    await esperar(300);
  } while (todasAsVagas.length < total && pagina <= 10); // limite de 10 páginas (1000 vagas) por corrida

  return todasAsVagas;
}

function normalizarVagaITJobs(vagaITJobs) {
  const titulo = vagaITJobs.title || "";
  const descricao = limparHtml(vagaITJobs.body || "");


  const idsContrato = (vagaITJobs.contracts || []).map((c) => Number(c.id));
  const ehEstagioPorContrato = idsContrato.some((id) => CONTRATOS_ESTAGIO.includes(id));
  const senioridade = ehEstagioPorContrato ? "estagio" : classificarSenioridade(titulo, descricao);

  const localizacao = vagaITJobs.locations?.[0]?.name || "Portugal";

  return {
    titulo,
    empresaNome: vagaITJobs.company?.name || "Empresa não indicada",
    urlOriginal: `https://www.itjobs.pt/oferta/${vagaITJobs.id}/${vagaITJobs.slug}`,
    dataPost: vagaITJobs.publishedAt ? vagaITJobs.publishedAt.split(" ")[0] : null,
    area: classificarArea(titulo, descricao),
    senioridade,
    salarioMin: vagaITJobs.salaryMin || null,
    salarioMax: vagaITJobs.salaryMax || null,
    regime: REGIME_POR_WORK_MODEL[vagaITJobs.workModel] || "presencial",
    localizacao,
    descricao,
    tecnologias: extrairTecnologias(descricao),
    fonteNome: "itjobs",
  };
}

module.exports = { fetchVagasITJobs, normalizarVagaITJobs };