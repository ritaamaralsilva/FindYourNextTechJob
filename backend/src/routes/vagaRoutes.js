const express = require("express");
const router = express.Router();
const { listar, opcoes, detalhes } = require("../controllers/vagaController");

router.get("/opcoes-filtro", opcoes);
router.get("/:id", detalhes);
router.get("/", listar);


module.exports = router;