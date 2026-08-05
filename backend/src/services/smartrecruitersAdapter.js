const {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  extrairTecnologias,
} = require("./classificadores");

const EMPRESAS_SMARTRECRUITERS = [
  "NatixisInPortugal",
  "Deloitte6",
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchVagasSmartRecruiters() {
  const todasAsVagas = [];

  for (const empresa of EMPRESAS_SMARTRECRUITERS) {
    const url = `https://api.smartrecruiters.com/v1/companies/${empresa}/postings?country=pt&limit=100`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro SmartRecruiters (${empresa}):`, response.status);
      continue;
    }

    const data = await response.json();
    const vagasComEmpresa = (data.content || []).map((vaga) => ({
      ...vaga,
      _empresaSlug: empresa,
    }));

    todasAsVagas.push(...vagasComEmpresa);
    await esperar(300);
  }

  return todasAsVagas;
}

function normalizarVagaSmartRecruiters(vagaSR) {
  const titulo = vagaSR.name || "";
  const descricao = limparHtml(vagaSR.jobAd?.sections?.jobDescription?.text || "");

  return {
    titulo,
    empresaNome: vagaSR.company?.name || vagaSR._empresaSlug,
    urlOriginal: vagaSR.applyUrl || vagaSR.ref,
    dataPost: vagaSR.releasedDate ? vagaSR.releasedDate.split("T")[0] : null,
    area: classificarArea(titulo, descricao),
    senioridade: classificarSenioridade(titulo, descricao),
    salarioMin: null,
    salarioMax: null,
    regime: vagaSR.location?.remote ? "remoto" : "presencial",
    localizacao: vagaSR.location?.city || "Portugal",
    descricao,
    tecnologias: extrairTecnologias(descricao),
    fonteNome: "smartrecruiters",
  };
}

module.exports = { fetchVagasSmartRecruiters, normalizarVagaSmartRecruiters };