const express = require("express");
const router = express.Router();
const { correrIngestaoAdzuna } = require("../jobs/ingestaoJob");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { runIngestaoJooble, runIngestaoITJobs, runIngestaoArbeitnow, runIngestaoIEFP, runIngestaoGreenhouse, runIngestaoLever, runIngestaoSmartRecruiters } = require("../jobs/ingestaoJob");

// rotas das apis de jobs (Adzuna, Jooble, ITJobs) para ingestão de vagas no front end 

router.post("/adzuna", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await correrIngestaoAdzuna();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/jooble", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoJooble();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/itjobs", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoITJobs();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/arbeitnow", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoArbeitnow();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/iefp", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoIEFP();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/greenhouse", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoGreenhouse();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/lever", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoLever();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

router.post("/smartrecruiters", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const resultado = await runIngestaoSmartRecruiters();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

module.exports = router;