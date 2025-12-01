const AsymmetricService = require('../services/asymmetricService');
const User = require('../models/user.model');

/**
 * Controlador para operaciones de cifrado asimétrico
 */

// Almacenamiento temporal de llaves (en producción usar base de datos o servicio de gestión de llaves)
const keyStore = new Map();

/**
 * Generar par de llaves RSA
 */
const generateRSAKeys = async (req, res) => {
    try {
        const { keySize = 2048, userId } = req.body;

        // Validar tamaño de llave
        if (keySize < 2048 || keySize > 4096) {
            return res.status(400).json({
                success: false,
                message: 'El tamaño de llave debe estar entre 2048 y 4096 bits'
            });
        }

        // Generar par de llaves
        const keyPair = AsymmetricService.generateRSAKeyPair(keySize);

        // Si se proporciona userId, guardar las llaves (opcional)
        if (userId) {
            keyStore.set(`rsa_${userId}`, keyPair);
            
            // En producción, guardar en base de datos
            // await User.findByIdAndUpdate(userId, { 
            //     rsaPublicKey: keyPair.publicKey,
            //     // NUNCA guardar la llave privada en la base de datos sin cifrar
            // });
        }

        res.status(200).json({
            success: true,
            message: 'Par de llaves RSA generado correctamente',
            data: keyPair
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Generar par de llaves DSA
 */
const generateDSAKeys = async (req, res) => {
    try {
        const { keySize = 2048, userId } = req.body;

        // Validar tamaño de llave
        if (keySize < 1024 || keySize > 3072) {
            return res.status(400).json({
                success: false,
                message: 'El tamaño de llave DSA debe estar entre 1024 y 3072 bits'
            });
        }

        // Generar par de llaves
        const keyPair = AsymmetricService.generateDSAKeyPair(keySize);

        // Si se proporciona userId, guardar las llaves (opcional)
        if (userId) {
            keyStore.set(`dsa_${userId}`, keyPair);
        }

        res.status(200).json({
            success: true,
            message: 'Par de llaves DSA generado correctamente',
            data: keyPair
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Generar par de llaves ECDSA (alternativa moderna a DSA)
 */
const generateECDSAKeys = async (req, res) => {
    try {
        const { curve = 'prime256v1', userId } = req.body;

        // Curvas soportadas
        const supportedCurves = ['prime256v1', 'secp384r1', 'secp521r1'];
        if (!supportedCurves.includes(curve)) {
            return res.status(400).json({
                success: false,
                message: `Curva no soportada. Use una de: ${supportedCurves.join(', ')}`
            });
        }

        // Generar par de llaves
        const keyPair = AsymmetricService.generateECDSAKeyPair(curve);

        // Si se proporciona userId, guardar las llaves (opcional)
        if (userId) {
            keyStore.set(`ecdsa_${userId}`, keyPair);
        }

        res.status(200).json({
            success: true,
            message: 'Par de llaves ECDSA generado correctamente',
            data: keyPair
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Cifrar con RSA-OAEP
 */
const encryptRSA = async (req, res) => {
    try {
        const { text, publicKey } = req.body;

        // Validar entrada
        if (!text || !publicKey) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto y la llave pública en base64'
            });
        }

        // Validar longitud del texto (RSA tiene límite según el tamaño de la llave)
        if (text.length > 190) { // Aproximado para RSA-2048 con OAEP
            return res.status(400).json({
                success: false,
                message: 'El texto es demasiado largo para cifrar con RSA. Use cifrado híbrido para textos largos.'
            });
        }

        // Cifrar
        const result = AsymmetricService.encryptRSA(text, publicKey);

        res.status(200).json({
            success: true,
            message: 'Texto cifrado correctamente con RSA-OAEP',
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
 * Descifrar con RSA-OAEP
 */
const decryptRSA = async (req, res) => {
    try {
        const { encryptedData, privateKey } = req.body;

        // Validar entrada
        if (!encryptedData || !privateKey) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto cifrado y la llave privada en base64'
            });
        }

        // Descifrar
        const result = AsymmetricService.decryptRSA(encryptedData, privateKey);

        res.status(200).json({
            success: true,
            message: 'Texto descifrado correctamente con RSA-OAEP',
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
 * Firmar mensaje con DSA/ECDSA
 */
const signDSA = async (req, res) => {
    try {
        const { message, privateKey, algorithm = 'DSA' } = req.body;

        // Validar entrada
        if (!message || !privateKey) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el mensaje y la llave privada en base64'
            });
        }

        // Firmar
        const result = AsymmetricService.signMessage(message, privateKey, algorithm);

        res.status(200).json({
            success: true,
            message: `Mensaje firmado correctamente con ${algorithm}`,
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
 * Verificar firma DSA/ECDSA
 */
const verifyDSA = async (req, res) => {
    try {
        const { message, signature, publicKey } = req.body;

        // Validar entrada
        if (!message || !signature || !publicKey) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el mensaje, la firma y la llave pública en base64'
            });
        }

        // Verificar
        const result = AsymmetricService.verifySignature(message, signature, publicKey);

        res.status(200).json({
            success: true,
            message: 'Verificación de firma completada',
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
 * Cifrar y firmar (operación híbrida)
 * Cifra con RSA y firma con DSA/ECDSA
 */
const encryptAndSign = async (req, res) => {
    try {
        const { text, recipientPublicKeyRSA, senderPrivateKeyDSA } = req.body;

        // Validar entrada
        if (!text || !recipientPublicKeyRSA || !senderPrivateKeyDSA) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el texto, la llave pública RSA del destinatario y la llave privada DSA del remitente'
            });
        }

        // Cifrar y firmar
        const result = AsymmetricService.encryptAndSign(text, recipientPublicKeyRSA, senderPrivateKeyDSA);

        res.status(200).json({
            success: true,
            message: 'Mensaje cifrado y firmado correctamente',
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
 * Verificar y descifrar (operación híbrida)
 */
const verifyAndDecrypt = async (req, res) => {
    try {
        const { encryptedData, signature, senderPublicKeyDSA, recipientPrivateKeyRSA } = req.body;

        // Validar entrada
        if (!encryptedData || !signature || !senderPublicKeyDSA || !recipientPrivateKeyRSA) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren todos los parámetros: datos cifrados, firma, llave pública DSA del remitente y llave privada RSA del destinatario'
            });
        }

        // Verificar y descifrar
        const result = AsymmetricService.verifyAndDecrypt(
            encryptedData, 
            signature, 
            senderPublicKeyDSA, 
            recipientPrivateKeyRSA
        );

        res.status(200).json({
            success: true,
            message: 'Mensaje verificado y descifrado correctamente',
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
 * Obtener llaves almacenadas (solo para desarrollo/testing)
 */
const getStoredKeys = async (req, res) => {
    try {
        const { userId, type } = req.params;
        const key = `${type}_${userId}`;

        if (!keyStore.has(key)) {
            return res.status(404).json({
                success: false,
                message: 'Llaves no encontradas para este usuario'
            });
        }

        const keys = keyStore.get(key);

        res.status(200).json({
            success: true,
            message: 'Llaves recuperadas',
            data: {
                publicKey: keys.publicKey,
                // NUNCA enviar la llave privada en producción
                // privateKey: keys.privateKey // Solo para desarrollo
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};