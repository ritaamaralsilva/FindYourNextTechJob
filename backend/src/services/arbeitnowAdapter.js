const {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  extrairTecnologias,
} = require("./classificadores");

async function fetchVagasArbeitnow() {
  const response = await fetch("https://www.arbeitnow.com/api/job-board-api");

  if (!response.ok) {
    console.error("Erro Arbeitnow:", response.status);
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

function normalizarVagaArbeitnow(vagaArbeitnow) {
  const titulo = vagaArbeitnow.title || "";
  const descricao = limparHtml(vagaArbeitnow.description || "");

  return {
    titulo,
    empresaNome: vagaArbeitnow.company_name || "Empresa não indicada",
    urlOriginal: vagaArbeitnow.url,
    dataPost: vagaArbeitnow.created_at
      ? new Date(vagaArbeitnow.created_at * 1000).toISOString().split("T")[0]
      : null,
    area: classificarArea(titulo, descricao),
    senioridade: classificarSenioridade(titulo),
    salarioMin: null,
    salarioMax: null,
    regime: vagaArbeitnow.remote ? "remoto" : "presencial",
    localizacao: vagaArbeitnow.location || "Europa",
    descricao,
    tecnologias: extrairTecnologias(descricao),
    fonteNome: "arbeitnow",
  };
}

module.exports = { fetchVagasArbeitnow, normalizarVagaArbeitnow };