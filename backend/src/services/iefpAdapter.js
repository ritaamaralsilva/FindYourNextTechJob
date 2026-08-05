const cheerio = require("cheerio");
const { classificarArea } = require("./classificadores");

const BASE_URL = "https://iefponline.iefp.pt/IEFP/pesquisas/pesqOfertasEstagio.do";
const USER_AGENT = "FindYourNextTechJob/1.0 (projeto pessoal, contacto: rita.asilva93@gmail.com)";

// códigos CPP de profissões tech identificados manualmente na pesquisa do IEFP
const CODIGOS_CPP_TECH = [
  "345", // Programador de Software
  "351", // Outros Analistas e Programadores de Software
  "349", // Programador de Aplicações
  "347", // Programador Web e de Multimédia
  "360", // Especialista em Bases de Dados
  "358", // Especialista de Redes Informáticas
  "354", // Administrador e Especialista de Conceção de Bases de Dados
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function acumularCookies(jar, response) {
  const setCookies = response.headers.getSetCookie
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie")].filter(Boolean);

  setCookies.forEach((cookieStr) => {
    const parPrincipal = cookieStr.split(";")[0];
    const idx = parPrincipal.indexOf("=");
    if (idx === -1) return;
    const nome = parPrincipal.substring(0, idx).trim();
    const valor = parPrincipal.substring(idx + 1).trim();
    jar[nome] = valor;
  });
}

function setCookieHeader(jar) {
  return Object.entries(jar)
    .map(([nome, valor]) => `${nome}=${valor}`)
    .join("; ");
}

async function lerRespostaComEncoding(response) {
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder("iso-8859-1");
  return decoder.decode(buffer);
}

// GET inicial (estabelece sessão) + POST com os critérios de pesquisa para UM código CPP
async function iniciarSessaoComPesquisa(codigoCPP) {
  const jar = {};

  const resp1 = await fetch(BASE_URL, {
    headers: { "User-Agent": USER_AGENT },
  });
  acumularCookies(jar, resp1);

  const params = new URLSearchParams({
    processoId: "",
    candidaturaId: "",
    codRegiaoSearch: "100",
    codConcelhoSearch: "",
    codCPP: codigoCPP,
    codAreaFormacao: "480",
    codMinimoQual: "",
    codMaximoQual: "",
    action: "Pesquisar",
    autoSearch: "l",
  });

  const resp2 = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": setCookieHeader(jar),
      "User-Agent": USER_AGENT,
    },
    body: params.toString(),
  });
  acumularCookies(jar, resp2);

  return jar;
}

async function buscarPagina(jar, pagina, numResultados = 50) {
  const url = `${BASE_URL}?autoSearch=l&pag=${pagina}&numRes=${numResultados}`;

  const response = await fetch(url, {
    headers: {
      "Cookie": setCookieHeader(jar),
      "User-Agent": USER_AGENT,
    },
  });
  acumularCookies(jar, response);

  if (!response.ok) {
    console.error(`Erro IEFP (página ${pagina}):`, response.status);
    return [];
  }

  const html = await lerRespostaComEncoding(response);
  return extrairVagasDoHtml(html);
}

// pagina até esgotar os resultados de UMA pesquisa (um código CPP) já com sessão ativa
async function paginarTodosOsResultados(jar) {
  const numResultados = 50;
  const vagas = [];
  let pagina = 0;

  while (pagina < 20) {
    const vagasPagina = await buscarPagina(jar, pagina, numResultados);
    if (vagasPagina.length === 0) break;
    vagas.push(...vagasPagina);

    if (vagasPagina.length < numResultados) break;
    pagina++;
    await esperar(500);
  }

  return vagas;
}

async function fetchVagasIEFP() {
  const todasVagas = [];

  for (const codigoCPP of CODIGOS_CPP_TECH) {
    console.log(`IEFP: a pesquisar código CPP ${codigoCPP}...`);

    const jar = await iniciarSessaoComPesquisa(codigoCPP);
    const vagas = await paginarTodosOsResultados(jar);

    todasVagas.push(...vagas);

    await esperar(500); // pausa entre cada código CPP, nova sessão a seguir
  }

  return todasVagas;
}

function extrairVagasDoHtml(html) {
  const $ = cheerio.load(html);
  const vagas = [];

  $("article.offer-card").each((i, elemento) => {
    const $card = $(elemento);

    const titulo = $card.find("h3.offer-card-title").text().trim();
    const onclick = $card.attr("onclick") || "";
    const match = onclick.match(/idOferta=(\d+)/);
    const idOferta = match ? match[1] : null;
    const localizacao = $card.find(".card-footer-text").last().text().trim();

    if (titulo && idOferta) {
      vagas.push({ idOferta, titulo, localizacao });
    }
  });

  return vagas;
}

// função nova — extrai só a cidade/concelho, descartando a freguesia
function normalizarLocalizacao(localizacaoBruta) {
  if (!localizacaoBruta) return "Portugal";

  // o IEFP separa cidade e freguesia com " - ", ex.: "COIMBRA - U.F. SÃO MARTINHO..."
  const [cidade] = localizacaoBruta.split(" - ");

  // capitaliza (o IEFP devolve tudo em maiúsculas) para ficar consistente
  // com as outras fontes, que já vêm em Title Case
  return cidade
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (letra) => letra.toUpperCase());
}

function normalizarVagaIEFP(vagaIEFP) {
  return {
    titulo: vagaIEFP.titulo,
    empresaNome: null,
    urlOriginal: `https://iefponline.iefp.pt/IEFP/pesquisas/detalheOfertasEstagio.do?idOferta=${vagaIEFP.idOferta}`,
    dataPost: null,
    area: classificarArea(vagaIEFP.titulo, ""),
    senioridade: "estagio",
    salarioMin: null,
    salarioMax: null,
    regime: null,
    localizacao: normalizarLocalizacao(vagaIEFP.localizacao),
    descricao: "",
    tecnologias: "",
    fonteNome: "iefp",
  };
}

module.exports = { fetchVagasIEFP, normalizarVagaIEFP };