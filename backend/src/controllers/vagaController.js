const { listarVagas, opcoesFiltro } = require("../models/vagaModel");

async function listar(req, res) {
  const vagas = await listarVagas(req.query);
  res.json({ vagas });
}

async function opcoes(req, res) {
  const opcoes = await opcoesFiltro();
  res.json(opcoes);
}

module.exports = { listar, opcoes };