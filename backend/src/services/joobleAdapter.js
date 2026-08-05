const {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  classificarRegime,
  extrairTecnologias,
} = require("./classificadores");

const TERMOS_TECH = [
  "software developer", "software engineer", "frontend developer",
  "backend developer", "full stack developer", "mobile developer",
  "android developer", "ios developer", "data engineer", "data scientist",
  "data analyst", "machine learning engineer", "ai engineer",
  "devops engineer", "platform engineer", "cloud engineer",
  "site reliability engineer", "cloud architect", "software architect",
  "database administrator", "system administrator", "network engineer",
  "security engineer", "cybersecurity analyst", "qa engineer",
  "test automation engineer", "ui/ux designer", "product manager",
  "technical project manager", "scrum master", "engineering manager", "tech lead",
];


function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchVagasJooble() {
  const apiKey = process.env.JOOBLE_API_KEY;
  const todasAsVagas = [];

  for (const termo of TERMOS_TECH) {
    const response = await fetch(`https://jooble.org/api/${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: termo,
        location: "Portugal",
      }),
    });

    if (!response.ok) {
      console.error(`Erro Jooble (${termo}):`, response.status);
      continue;
    }

    const data = await response.json();
    todasAsVagas.push(...(data.jobs || []));

    await esperar(300);
  }

  return todasAsVagas;
}


// normaliza o formato da Jooble para o schema unificado da base de dados em mySQL
function normalizarVagaJooble(vagaJooble) {
  const titulo = vagaJooble.title || "";
  const descricao = limparHtml(vagaJooble.snippet || "");

  return {
    titulo,
    empresaNome: vagaJooble.company || "Empresa não indicada",
    urlOriginal: vagaJooble.link,
    dataPost: vagaJooble.updated ? vagaJooble.updated.split("T")[0] : null,
    area: classificarArea(titulo, descricao),
    senioridade: classificarSenioridade(titulo, descricao),
    salarioMin: null, // a Jooble devolve salário como texto livre (ex.: "€1200 - €1500")
    salarioMax: null,
    regime: classificarRegime(titulo, descricao),
    localizacao: vagaJooble.location || "Portugal",
    descricao,
    tecnologias: extrairTecnologias(descricao),
    fonteNome: "jooble",
  };
}

module.exports = { fetchVagasJooble, normalizarVagaJooble };