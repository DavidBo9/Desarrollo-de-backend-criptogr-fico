const express = require('express');
const router = express.Router();
const symmetricController = require('../controllers/symmetric.controller');

// AES Routes 
router.post('/encrypt/aes_cbc', symmetricController.encryptAes);
router.post('/decrypt/aes_cbc', symmetricController.decryptAes);

// ChaCha20 Routes 
router.post('/encrypt/chacha20', symmetricController.encryptChaCha);
router.post('/decrypt/chacha20', symmetricController.decryptChaCha);

module.exports = router;