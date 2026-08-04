const { fetchVagasJooble, normalizarVagaJooble } = require("../services/joobleAdapter");
const { fetchVagasITJobs, normalizarVagaITJobs } = require("../services/itJobsAdapter");
const { fetchVagasArbeitnow, normalizarVagaArbeitnow } = require("../services/arbeitnowAdapter");
const { guardarVaga } = require("../models/ingestaoModel");

async function runIngestaoJooble() {
  console.log("A ir buscar vagas à Jooble...");
  const vagas = await fetchVagasJooble();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaJooble(vagaBruta));
    if (id) novas++;
  }

  console.log(`Jooble: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

async function runIngestaoITJobs() {
  console.log("A ir buscar vagas à ITJobs...");
  const vagas = await fetchVagasITJobs();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaITJobs(vagaBruta));
    if (id) novas++;
  }
  console.log(`ITJobs: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

  async function runIngestaoArbeitnow() {
  console.log("A ir buscar vagas à Arbeitnow...");
  const vagas = await fetchVagasArbeitnow();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaArbeitnow(vagaBruta));
    if (id) novas++;
  }

  console.log(`Arbeitnow: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

module.exports = { runIngestaoJooble, runIngestaoITJobs, runIngestaoArbeitnow };