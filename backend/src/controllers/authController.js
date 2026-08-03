// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encontrarPorEmail, criarUtilizador } = require("../models/userModel");

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

module.exports = { login, me, logout };