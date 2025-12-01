const express = require('express');
const router = express.Router();
const {
    generateRSAKeys,
    generateDSAKeys,
    generateECDSAKeys,
    encryptRSA,
    decryptRSA,
    signDSA,
    verifyDSA,
    encryptAndSign,
    verifyAndDecrypt,
    getStoredKeys
} = require('../controllers/asymmetric.controller');

/**
 * Rutas para Cifrado Asimétrico y Firma Digital
 * Base paths: /api/encrypt, /api/decrypt, /api/sign, /api/verify
 */

// Generación de llaves
router.post('/generate/rsa', generateRSAKeys);
router.post('/generate/dsa', generateDSAKeys);
router.post('/generate/ecdsa', generateECDSAKeys);

// RSA - Cifrado/Descifrado
router.post('/encrypt/rsa', encryptRSA);
router.post('/decrypt/rsa', decryptRSA);

// DSA/ECDSA - Firma/Verificación
router.post('/sign/dsa', signDSA);
router.post('/verify/dsa', verifyDSA);

// Operaciones híbridas (RSA + DSA/ECDSA)
router.post('/hybrid/encrypt-sign', encryptAndSign);
router.post('/hybrid/verify-decrypt', verifyAndDecrypt);

// Utilidad para desarrollo (NO usar en producción)
router.get('/keys/:type/:userId', getStoredKeys);

module.exports = router;