const pool = require("../config/db");

async function listarVagas(filtros) {
  const {
    area, stack, cidade, regime, senioridade, data,
    ordenar = "recente", pagina = 1, porPagina,
  } = filtros;

  const condicoes = [];
  const valores = [];

  if (area) {
    condicoes.push("v.area = ?");
    valores.push(area);
  }
  if (stack) {
    condicoes.push("v.tecnologias LIKE ?");
    valores.push(`%${stack}%`);
  }
  if (cidade) {
    condicoes.push("v.localizacao LIKE ?");
    valores.push(`%${cidade}%`);
  }
  if (regime) {
    condicoes.push("v.regime = ?");
    valores.push(regime);
  }
  if (senioridade) {
    condicoes.push("v.senioridade = ?");
    valores.push(senioridade);
  }

  const diasPorOpcao = { "24h": 1, semana: 7, mes: 30 };
  if (data && diasPorOpcao[data]) {
    condicoes.push("v.data_post >= DATE_SUB(CURDATE(), INTERVAL ? DAY)");
    valores.push(diasPorOpcao[data]);
  }

  const whereClause = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
  const direcaoOrdem = ordenar === "antiga" ? "ASC" : "DESC";

  const [totalRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM vagas v ${whereClause}`,
    valores
  );
  const total = totalRows[0].total;

  const mostrarTodas = !porPagina || porPagina === "all";

  let query = `
    SELECT v.*, e.nome AS empresa, f.nome AS fonte
    FROM vagas v
    LEFT JOIN empresas e ON v.empresa_id = e.id
    LEFT JOIN fontes f ON v.fonte_id = f.id
    ${whereClause}
    ORDER BY v.data_post ${direcaoOrdem}
  `;
  const params = [...valores];

  if (!mostrarTodas) {
    const offset = (pagina - 1) * porPagina;
    query += " LIMIT ? OFFSET ?";
    params.push(Number(porPagina), Number(offset));
  }

  const [rows] = await pool.query(query, params);

  return { vagas: rows, total };
}

async function opcoesFiltro() {
  const [areas] = await pool.query("SELECT DISTINCT area FROM vagas WHERE area IS NOT NULL");
  const [cidades] = await pool.query("SELECT DISTINCT localizacao FROM vagas WHERE localizacao IS NOT NULL");

  return {
    areas: areas.map((r) => r.area),
    cidades: cidades.map((r) => r.localizacao),
    regimes: ["remoto", "hibrido", "presencial"],
    senioridades: ["estagio", "junior", "mid", "senior"],
  };
}

async function fetchVagaPorId(id) {
  const [rows] = await pool.query(
    `SELECT v.*, e.nome AS empresa, e.site AS empresa_site, f.nome AS fonte
     FROM vagas v
     LEFT JOIN empresas e ON v.empresa_id = e.id
     LEFT JOIN fontes f ON v.fonte_id = f.id
     WHERE v.id = ?`,
    [id]
  );
  return rows[0];
}

module.exports = { listarVagas, opcoesFiltro, fetchVagaPorId };