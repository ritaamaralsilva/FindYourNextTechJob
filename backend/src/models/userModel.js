const pool = require("../config/db");

async function encontrarPorEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

async function criarUtilizador({ nome, email, passwordHash, telefone, tokenVerificacao }) {
  const [result] = await pool.query(
    `INSERT INTO users (nome, email, password_hash, telefone, role, email_verificado, token_verificacao)
     VALUES (?, ?, ?, ?, 'candidato', false, ?)`,
    [nome, email, passwordHash, telefone, tokenVerificacao]
  );
  return result.insertId;
}

async function verificarEmailPorToken(token) {
  const utilizador = await pool.query(
    "SELECT id, email_verificado FROM users WHERE token_verificacao = ?",
    [token]
  );

  if (utilizador[0].length === 0) return false;

  await pool.query(
    "UPDATE users SET email_verificado = true WHERE token_verificacao = ?",
    [token]
  );

  return true;
}

async function gerarTokenReset(email) {
  const utilizador = await encontrarPorEmail(email);
  if (!utilizador) return null;

  const token = crypto.randomUUID();
  const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await pool.query(
    "UPDATE users SET token_reset_password = ?, token_reset_expira = ? WHERE id = ?",
    [token, expira, utilizador.id]
  );

  return token;
}

async function encontrarPorTokenReset(token) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE token_reset_password = ? AND token_reset_expira > NOW()",
    [token]
  );
  return rows[0];
}

async function atualizarPassword(userId, passwordHash) {
  await pool.query(
    "UPDATE users SET password_hash = ?, token_reset_password = NULL, token_reset_expira = NULL WHERE id = ?",
    [passwordHash, userId]
  );
}

module.exports = { encontrarPorEmail, criarUtilizador, verificarEmailPorToken, gerarTokenReset, encontrarPorTokenReset, atualizarPassword };