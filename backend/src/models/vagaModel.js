const pool = require("../config/db");

async function listarVagas(filtros) {
  const { area, stack, cidade, regime, senioridade, pagina = 1, porPagina = 20 } = filtros;

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

  const whereClause = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
  const offset = (pagina - 1) * porPagina;

  const [rows] = await pool.query(
    `SELECT v.*, e.nome AS empresa, f.nome AS fonte
     FROM vagas v
     LEFT JOIN empresas e ON v.empresa_id = e.id
     LEFT JOIN fontes f ON v.fonte_id = f.id
     ${whereClause}
     ORDER BY v.data_post DESC
     LIMIT ? OFFSET ?`,
    [...valores, Number(porPagina), Number(offset)]
  );

  return rows;
}

async function opcoesFiltro() {
  const [areas] = await pool.query("SELECT DISTINCT area FROM vagas WHERE area IS NOT NULL");
  const [cidades] = await pool.query("SELECT DISTINCT localizacao FROM vagas WHERE localizacao IS NOT NULL");

  return {
    areas: areas.map((r) => r.area),
    cidades: cidades.map((r) => r.localizacao),
    regimes: ["remoto", "hibrido", "presencial"],
    senioridades: ["estagio", "junior", "pleno", "senior"],
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