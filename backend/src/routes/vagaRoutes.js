const express = require("express");
const router = express.Router();
const { listar, opcoes } = require("../controllers/vagaController");

router.get("/", listar);
router.get("/opcoes-filtro", opcoes);

module.exports = router;