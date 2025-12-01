// routes/hash.route.js

const express = require("express");
const router = express.Router();

const HashController = require("../controllers/hash.controller");

router.post("/sha256", HashController.generarSHA256);
router.post("/argon2", HashController.generarArgon2);
router.post("/verify", HashController.verificarArgon2);

module.exports = router;
