// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login, me, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

module.exports = router;