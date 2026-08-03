const express = require("express");
const router = express.Router();
const { correrIngestaoAdzuna } = require("../jobs/ingestaoJob");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { correrIngestaoJooble } = require("../jobs/ingestaoJob");

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
    const resultado = await correrIngestaoJooble();
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro na ingestão" });
  }
});

module.exports = router;