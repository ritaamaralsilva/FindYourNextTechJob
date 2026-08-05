const {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  extrairTecnologias,
} = require("./classificadores");

// slug de cada empresa no Lever — encontra-se no URL: jobs.lever.co/{slug}
const EMPRESAS_LEVER = [
    "swordhealth",
  // acrescenta aqui à medida que identificares empresas PT que usam Lever
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchVagasLever() {
  const todasAsVagas = [];

  for (const empresa of EMPRESAS_LEVER) {
    const url = `https://api.lever.co/v0/postings/${empresa}?mode=json`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro Lever (${empresa}):`, response.status);
      continue;
    }

    const data = await response.json();
    const vagasComEmpresa = data.map((vaga) => ({ ...vaga, _empresaSlug: empresa }));
    todasAsVagas.push(...vagasComEmpresa);
    await esperar(300);
  }

  return todasAsVagas.filter((vaga) => {
    const localizacao = (vaga.categories?.location || "").toLowerCase();
    return (
      localizacao.includes("portugal") ||
      localizacao.includes("lisbon") ||
      localizacao.includes("lisboa") ||
      localizacao.includes("porto")
    );
  });
}

function normalizarVagaLever(vagaLever) {
  const titulo = vagaLever.text || "";
  const descricao = limparHtml(vagaLever.descriptionPlain || vagaLever.description || "");

  return {
    titulo,
    empresaNome: vagaLever._empresaSlug,
    urlOriginal: vagaLever.hostedUrl,
    dataPost: vagaLever.createdAt
      ? new Date(vagaLever.createdAt).toISOString().split("T")[0]
      : null,
    area: classificarArea(titulo, descricao),
    senioridade: classificarSenioridade(titulo, descricao),
    salarioMin: null,
    salarioMax: null,
    regime: /remote|remoto/i.test(descricao) ? "remoto" : "presencial",
    localizacao: vagaLever.categories?.location || "Portugal",
    descricao,
    tecnologias: extrairTecnologias(descricao),
    fonteNome: "lever",
  };
}

module.exports = { fetchVagasLever, normalizarVagaLever };