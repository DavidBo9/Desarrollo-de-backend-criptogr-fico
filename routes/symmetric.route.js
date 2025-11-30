const express = require('express');
const router = express.Router();
const {
    encryptAES,
    decryptAES,
    encryptChaCha20,
    decryptChaCha20,
    generateKey,
    initDiffieHellman,
    completeDiffieHellman
} = require('../controllers/symmetric.controller');

/**
 * Rutas para Cifrado Simétrico
 * Base path: /api/encrypt
 */

// AES-256-CBC
router.post('/encrypt/aes_cbc', encryptAES);
router.post('/decrypt/aes_cbc', decryptAES);

// ChaCha20
router.post('/encrypt/chacha20', encryptChaCha20);
router.post('/decrypt/chacha20', decryptChaCha20);

// Utilidades
router.get('/generate-key', generateKey);

// Diffie-Hellman para intercambio de llaves
router.post('/diffie-hellman/init', initDiffieHellman);
router.post('/diffie-hellman/complete', completeDiffieHellman);

module.exports = router;