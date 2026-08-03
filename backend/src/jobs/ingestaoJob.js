const { fetchVagasJooble, normalizarVagaJooble } = require("../services/joobleAdapter");
const { guardarVaga } = require("../models/ingestaoModel");

async function correrIngestaoJooble() {
  console.log("A ir buscar vagas à Jooble...");
  const vagasJooble = await fetchVagasJooble();

  let novas = 0;
  for (const vagaBruta of vagasJooble) {
    const normalizada = normalizarVagaJooble(vagaBruta);
    const id = await guardarVaga(normalizada);
    if (id) novas++;
  }

  console.log(`Ingestão concluída: ${novas} vagas novas de ${vagasJooble.length} recebidas.`);
  return { total: vagasJooble.length, novas };
}

module.exports = { correrIngestaoJooble };