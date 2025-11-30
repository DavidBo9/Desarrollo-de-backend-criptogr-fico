const express = require('express');
const router = express.Router();
const symmetricController = require('../controllers/symmetric.controller');

// AES Routes 
router.post('/api/encrypt/aes_cbc', symmetricController.encryptAes);
router.post('/api/decrypt/aes_cbc', symmetricController.decryptAes);

// ChaCha20 Routes 
router.post('/api/encrypt/chacha20', symmetricController.encryptChaCha);
router.post('/api/decrypt/chacha20', symmetricController.decryptChaCha);

module.exports = router;