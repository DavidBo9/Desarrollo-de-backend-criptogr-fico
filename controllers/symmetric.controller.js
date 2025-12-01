const cryptoService = require('../services/symmetricService.js'); // Ajusta la ruta

const symmetricController = {
    // Endpoint: POST /api/encrypt/aes_cbc
    encryptAes: (req, res) => {
        try {
            const { text } = req.body; // El texto que el usuario manda
            if (!text) return res.status(400).json({ error: 'Falta el campo text' });

            const result = cryptoService.aesEncrypt(text);
            res.json(result); // Devuelve JSON [cite: 19]
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Endpoint: POST /api/decrypt/aes_cbc
    decryptAes: (req, res) => {
        try {
            // Recibimos ciphertext, key y iv en Base64
            const { ciphertext, key, iv } = req.body;
            if (!ciphertext || !key || !iv) {
                return res.status(400).json({ error: 'Faltan datos (ciphertext, key, iv)' });
            }

            const plainText = cryptoService.aesDecrypt(ciphertext, key, iv);
            res.json({ plainText });
        } catch (error) {
            // Si la clave o IV no coinciden, fallará aquí
            res.status(400).json({ error: 'Error al descifrar. Verifique clave/IV.' });
        }
    },

    // Endpoint: POST /api/encrypt/chacha20
    encryptChaCha: (req, res) => {
        try {
            const { text } = req.body;
            const result = cryptoService.chachaEncrypt(text);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Endpoint: POST /api/decrypt/chacha20
    decryptChaCha: (req, res) => {
        try {
            // ChaCha20 necesita el authTag también
            const { ciphertext, key, nonce, authTag } = req.body;
            if (!ciphertext || !key || !nonce || !authTag) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }

            const plainText = cryptoService.chachaDecrypt(ciphertext, key, nonce, authTag);
            res.json({ plainText });
        } catch (error) {
            res.status(400).json({ error: 'Error al descifrar o autenticar.' });
        }
    }
};

module.exports = symmetricController;