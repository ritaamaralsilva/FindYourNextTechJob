const { fetchVagasJooble, normalizarVagaJooble } = require("../services/joobleAdapter");
const { fetchVagasITJobs, normalizarVagaITJobs } = require("../services/itJobsAdapter");
const { fetchVagasArbeitnow, normalizarVagaArbeitnow } = require("../services/arbeitnowAdapter");
const { fetchVagasIEFP, normalizarVagaIEFP } = require("../services/iefpAdapter");
const { fetchVagasSmartRecruiters, normalizarVagaSmartRecruiters } = require("../services/smartrecruitersAdapter");
const { fetchVagasLever, normalizarVagaLever } = require("../services/leverAdapter");
const { fetchVagasGreenhouse, normalizarVagaGreenhouse } = require("../services/greenhouseAdapter");
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

async function runIngestaoIEFP() {
  console.log("A carregar vagas de estágios ao IEFP...");
  const vagas = await fetchVagasIEFP();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaIEFP(vagaBruta));
    if (id) novas++;
  }

  console.log(`IEFP: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

async function runIngestaoGreenhouse() {
  console.log("A ir buscar vagas ao Greenhouse...");
  const vagas = await fetchVagasGreenhouse();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaGreenhouse(vagaBruta));
    if (id) novas++;
  }

  console.log(`Greenhouse: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

async function runIngestaoLever() {
  console.log("A ir buscar vagas ao Lever...");
  const vagas = await fetchVagasLever();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaLever(vagaBruta));
    if (id) novas++;
  }

  console.log(`Lever: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

async function runIngestaoSmartRecruiters() {
  console.log("A ir buscar vagas ao SmartRecruiters...");
  const vagas = await fetchVagasSmartRecruiters();

  let novas = 0;
  for (const vagaBruta of vagas) {
    const id = await guardarVaga(normalizarVagaSmartRecruiters(vagaBruta));
    if (id) novas++;
  }

  console.log(`SmartRecruiters: ${novas} vagas novas de ${vagas.length} recebidas.`);
  return { total: vagas.length, novas };
}

module.exports = { runIngestaoJooble, runIngestaoITJobs, runIngestaoArbeitnow, runIngestaoIEFP, runIngestaoGreenhouse, runIngestaoLever, runIngestaoSmartRecruiters };