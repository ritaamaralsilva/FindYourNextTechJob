const pool = require("../config/db");

async function obterOuCriarEmpresa(nome) {
  const [existente] = await pool.query("SELECT id FROM empresas WHERE nome = ?", [nome]);
  if (existente.length > 0) return existente[0].id;

  const [result] = await pool.query("INSERT INTO empresas (nome) VALUES (?)", [nome]);
  return result.insertId;
}

async function obterOuCriarFonte(nome, tipo = "api") {
  const [existente] = await pool.query("SELECT id FROM fontes WHERE nome = ?", [nome]);
  if (existente.length > 0) return existente[0].id;

  const [result] = await pool.query("INSERT INTO fontes (nome, tipo) VALUES (?, ?)", [nome, tipo]);
  return result.insertId;
}

async function guardarVaga(vagaNormalizada) {
  const nomeEmpresa = vagaNormalizada.empresaNome || "Entidade não divulgada";
  const empresaId = await obterOuCriarEmpresa(nomeEmpresa);
  const fonteId = await obterOuCriarFonte(vagaNormalizada.fonteNome);

  const [existente] = await pool.query(
    "SELECT id FROM vagas WHERE url_original = ?",
    [vagaNormalizada.urlOriginal]
  );

  if (existente.length > 0) return null;

  const [result] = await pool.query(
    `INSERT INTO vagas
     (empresa_id, fonte_id, titulo, url_original, data_post, area, senioridade,
      salario_min, salario_max, regime, localizacao, descricao, tecnologias)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      empresaId,
      fonteId,
      vagaNormalizada.titulo,
      vagaNormalizada.urlOriginal,
      vagaNormalizada.dataPost,
      vagaNormalizada.area,
      vagaNormalizada.senioridade,
      vagaNormalizada.salarioMin,
      vagaNormalizada.salarioMax,
      vagaNormalizada.regime,
      vagaNormalizada.localizacao,
      vagaNormalizada.descricao,
      vagaNormalizada.tecnologias,
    ]
  );

  return result.insertId;
}

module.exports = { guardarVaga };