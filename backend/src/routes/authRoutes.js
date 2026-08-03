// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login, me, logout, registo, verificarEmail, forgotPassword, resetPassword } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/registo", registo);
router.get("/verificar-email", verificarEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

module.exports = router;