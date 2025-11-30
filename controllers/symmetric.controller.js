const CryptoService = require('../services/cryptoService');

/**
 * Controlador para operaciones de cifrado simétrico
 */

// Almacenamiento temporal de parámetros Diffie-Hellman (en producción usar base de datos)
const dhSessions = new Map();

/**
 * AES-256-CBC - Cifrar
 */
const encryptAES = async (req, res) => {
    try {
        const { text, key } = req.body;

        // Validar entrada
        if (!text || !key) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto y la llave en base64'
            });
        }

        // Cifrar
        const result = CryptoService.encryptAES256CBC(text, key);

        res.status(200).json({
            success: true,
            message: 'Texto cifrado correctamente con AES-256-CBC',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * AES-256-CBC - Descifrar
 */
const decryptAES = async (req, res) => {
    try {
        const { encryptedData, key, iv } = req.body;

        // Validar entrada
        if (!encryptedData || !key || !iv) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto cifrado, la llave y el IV en base64'
            });
        }

        // Descifrar
        const result = CryptoService.decryptAES256CBC(encryptedData, key, iv);

        res.status(200).json({
            success: true,
            message: 'Texto descifrado correctamente con AES-256-CBC',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ChaCha20 - Cifrar
 */
const encryptChaCha20 = async (req, res) => {
    try {
        const { text, key } = req.body;

        // Validar entrada
        if (!text || !key) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto y la llave en base64'
            });
        }

        // Cifrar
        const result = CryptoService.encryptChaCha20(text, key);

        res.status(200).json({
            success: true,
            message: 'Texto cifrado correctamente con ChaCha20-Poly1305',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ChaCha20 - Descifrar
 */
const decryptChaCha20 = async (req, res) => {
    try {
        const { encryptedData, key, nonce, authTag } = req.body;

        // Validar entrada
        if (!encryptedData || !key || !nonce || !authTag) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto cifrado, la llave, el nonce y el authTag en base64'
            });
        }

        // Descifrar
        const result = CryptoService.decryptChaCha20(encryptedData, key, nonce, authTag);

        res.status(200).json({
            success: true,
            message: 'Texto descifrado correctamente con ChaCha20-Poly1305',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Generar llave aleatoria
 */
const generateKey = async (req, res) => {
    try {
        const key = CryptoService.generateKey();

        res.status(200).json({
            success: true,
            message: 'Llave de 256 bits generada correctamente',
            data: {
                key,
                description: 'Llave en base64 para usar con AES-256 o ChaCha20'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Iniciar intercambio de llaves Diffie-Hellman
 */
const initDiffieHellman = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un sessionId único'
            });
        }

        // Generar parámetros DH
        const dhParams = CryptoService.generateDiffieHellman();
        
        // Guardar el objeto DH y la llave privada para esta sesión
        dhSessions.set(sessionId, {
            dhObject: dhParams.dhObject,
            publicKey: dhParams.publicKey,
            prime: dhParams.prime,
            generator: dhParams.generator,
            privateKey: dhParams.dhObject.getPrivateKey('base64')
        });

        res.status(200).json({
            success: true,
            message: 'Parámetros Diffie-Hellman generados',
            data: {
                sessionId,
                publicKey: dhParams.publicKey,
                prime: dhParams.prime,
                generator: dhParams.generator,
                instructions: 'Comparte estos parámetros con el otro participante y recibe su llave pública'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Completar intercambio de llaves Diffie-Hellman
 */
const completeDiffieHellman = async (req, res) => {
    try {
        const { sessionId, otherPublicKey, prime, generator } = req.body;

        if (!sessionId || !otherPublicKey) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere sessionId y la llave pública del otro participante'
            });
        }

        let sharedKey;

        // Si tenemos una sesión guardada
        if (dhSessions.has(sessionId)) {
            const session = dhSessions.get(sessionId);
            sharedKey = CryptoService.computeSharedSecret(session, otherPublicKey);
        } 
        // Si es un nuevo participante que recibe los parámetros
        else if (prime && generator) {
            const dh = CryptoService.generateDiffieHellmanWithParams(prime, generator);
            sharedKey = CryptoService.computeSharedSecret(
                {
                    prime,
                    generator,
                    publicKey: dh.publicKey,
                    privateKey: dh.dhObject.getPrivateKey('base64')
                },
                otherPublicKey
            );

            res.status(200).json({
                success: true,
                message: 'Llave compartida calculada correctamente',
                data: {
                    sharedKey,
                    myPublicKey: dh.publicKey,
                    description: 'Esta es tu llave compartida derivada del intercambio Diffie-Hellman'
                }
            });
            return;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Sesión no encontrada o parámetros incompletos'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Llave compartida calculada correctamente',
            data: {
                sharedKey,
                description: 'Esta es tu llave compartida derivada del intercambio Diffie-Hellman'
            }
        });

        // Limpiar la sesión después de usarla
        dhSessions.delete(sessionId);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    encryptAES,
    decryptAES,
    encryptChaCha20,
    decryptChaCha20,
    generateKey,
    initDiffieHellman,
    completeDiffieHellman
};