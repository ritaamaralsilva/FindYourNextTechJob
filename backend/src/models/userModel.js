const pool = require("../config/db");

async function encontrarPorEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

async function criarUtilizador({ nome, email, passwordHash, telefone }) {
  const [result] = await pool.query(
    `INSERT INTO users (nome, email, password_hash, telefone, role, email_verificado)
     VALUES (?, ?, ?, ?, 'candidato', false)`,
    [nome, email, passwordHash, telefone]
  );
  return result.insertId;
}

module.exports = { encontrarPorEmail, criarUtilizador };