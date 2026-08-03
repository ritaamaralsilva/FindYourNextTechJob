const { listarVagas, opcoesFiltro, fetchVagaPorId } = require("../models/vagaModel");

async function listar(req, res) {
  const vagas = await listarVagas(req.query);
  res.json({ vagas });
}

async function opcoes(req, res) {
  const opcoes = await opcoesFiltro();
  res.json(opcoes);
}

async function detalhes(req, res) {
    const vaga = await fetchVagaPorId(req.params.id);
    if (!vaga) {
        return res.status(404).json({ erro: "Vaga não encontrada" });
    }
    res.json({ vaga });
}

module.exports = { listar, opcoes, detalhes };