const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { encontrarPorEmail, criarUtilizador, verificarEmailPorToken, gerarTokenReset, encontrarPorTokenReset, atualizarPassword } = require("../models/userModel");
const { enviarEmailVerificacao, enviarEmailResetPassword } = require("../services/emailService");

async function login(req, res) {
  const { email, password } = req.body;

  const utilizador = await encontrarPorEmail(email);
  if (!utilizador) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const passwordCorreta = await bcrypt.compare(password, utilizador.password_hash);
  if (!passwordCorreta) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  if (!utilizador.email_verificado && utilizador.role !== "admin") {
    return res.status(403).json({ erro: "Email ainda não verificado" });
  }

  const token = jwt.sign(
    { id: utilizador.id, role: utilizador.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: utilizador.id,
      nome: utilizador.nome,
      email: utilizador.email,
      role: utilizador.role,
    },
  });
}

async function me(req, res) {
  res.json({ user: req.user });
}

function logout(req, res) {
  res.clearCookie("token");
  res.json({ mensagem: "Sessão terminada" });
}

async function registo(req, res) {
  const { nome, email, telefone, password } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ erro: "Nome, email e password são obrigatórios" });
  }

  const existente = await encontrarPorEmail(email);
  if (existente) {
    return res.status(409).json({ erro: "Já existe uma conta com este email" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const tokenVerificacao = crypto.randomUUID();

  await criarUtilizador({ nome, email, passwordHash, telefone, tokenVerificacao });
  await enviarEmailVerificacao(email, tokenVerificacao);

  res.status(201).json({ mensagem: "Conta criada. Verifica o teu email." });
}

async function verificarEmail(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ erro: "Token em falta" });
  }

  const verificado = await verificarEmailPorToken(token);

  if (!verificado) {
    return res.status(400).json({ erro: "Token inválido ou expirado" });
  }

  res.json({ mensagem: "Email verificado com sucesso" });
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: "Email é obrigatório" });
  }

  const token = await gerarTokenReset(email);

  if (token) {
    await enviarEmailResetPassword(email, token);
  }

  res.json({ mensagem: "Se esse email estiver registado, vais receber um link." });
}

async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ erro: "Token e password são obrigatórios" });
  }

  const utilizador = await encontrarPorTokenReset(token);
  if (!utilizador) {
    return res.status(400).json({ erro: "Token inválido ou expirado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await atualizarPassword(utilizador.id, passwordHash);

  res.json({ mensagem: "Password redefinida com sucesso" });
}

module.exports = { login, me, logout, registo, verificarEmail, forgotPassword, resetPassword };