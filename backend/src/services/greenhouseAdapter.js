const {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  extrairTecnologias,
} = require("./classificadores");

// board_token de cada empresa — encontra-se no URL da página de carreiras:
// job-boards.greenhouse.io/{board_token}
const EMPRESAS_GREENHOUSE = [
  "feedzai",
  "talkdesk2",
  "blip-global",
  "critical-techworks",
  "codacy",
  // acrescenta mais aqui à medida que fores identificando (ver instruções abaixo)
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchVagasGreenhouse() {
  const todasAsVagas = [];

  for (const empresa of EMPRESAS_GREENHOUSE) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${empresa}/jobs?content=true`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro Greenhouse (${empresa}):`, response.status);
      continue;
    }

    const data = await response.json();
    const vagasComEmpresa = (data.jobs || []).map((vaga) => ({
      ...vaga,
      _empresaSlug: empresa,
    }));

    todasAsVagas.push(...vagasComEmpresa);
    await esperar(300);
  }

  // filtra só vagas com localização em Portugal — estas empresas publicam
  // vagas globais, e só nos interessam as de PT
  return todasAsVagas.filter((vaga) => {
    const localizacao = (vaga.location?.name || "").toLowerCase();
    return (
      localizacao.includes("portugal") ||
      localizacao.includes("lisbon") ||
      localizacao.includes("lisboa") ||
      localizacao.includes("porto") ||
      localizacao.includes("coimbra") ||
      localizacao.includes("braga")
    );
  });
}

function normalizarVagaGreenhouse(vagaGreenhouse) {
  const titulo = vagaGreenhouse.title || "";
  const descricao = limparHtml(vagaGreenhouse.content || "");

  return {
    titulo,
    empresaNome: vagaGreenhouse._empresaSlug,
    urlOriginal: vagaGreenhouse.absolute_url,
    dataPost: vagaGreenhouse.updated_at
      ? vagaGreenhouse.updated_at.split("T")[0]
      : null,
    area: classificarArea(titulo, descricao),
    senioridade: classificarSenioridade(titulo, descricao),
    salarioMin: null,
    salarioMax: null,
    regime: /remote|remoto/i.test(descricao) ? "remoto" : "presencial",
    localizacao: vagaGreenhouse.location?.name || "Portugal",
    descricao,
    tecnologias: extrairTecnologias(descricao),
    fonteNome: "greenhouse",
  };
}

module.exports = { fetchVagasGreenhouse, normalizarVagaGreenhouse };