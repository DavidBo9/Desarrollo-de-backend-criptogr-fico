const crypto = require('crypto');

/**
 * Servicio de Cifrado Asimétrico
 * Implementa RSA-OAEP para cifrado y DSA/ECDSA para firma digital
 */

class AsymmetricService {
    /**
     * Generar par de llaves RSA
     * @param {number} modulusLength - Tamaño de la llave (default: 2048 bits)
     */
    static generateRSAKeyPair(modulusLength = 2048) {
        try {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: modulusLength,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            // Convertir a base64 para facilitar el transporte
            const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
            const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

            return {
                publicKey: publicKeyBase64,
                privateKey: privateKeyBase64,
                algorithm: 'RSA',
                keySize: modulusLength
            };
        } catch (error) {
            throw new Error(`Error generando llaves RSA: ${error.message}`);
        }
    }

    /**
     * Cifrar con RSA-OAEP usando llave pública
     * @param {string} text - Texto a cifrar
     * @param {string} publicKeyBase64 - Llave pública en base64
     */
    static encryptRSA(text, publicKeyBase64) {
        try {
            // Convertir la llave de base64 a PEM
            const publicKeyPem = Buffer.from(publicKeyBase64, 'base64').toString('utf8');

            // Cifrar usando RSA-OAEP con SHA-256
            const encrypted = crypto.publicEncrypt(
                {
                    key: publicKeyPem,
                    oaepHash: 'sha256',
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
                },
                Buffer.from(text, 'utf8')
            );

            return {
                encryptedData: encrypted.toString('base64'),
                algorithm: 'RSA-OAEP',
                hashAlgorithm: 'SHA-256'
            };
        } catch (error) {
            throw new Error(`Error al cifrar con RSA: ${error.message}`);
        }
    }

    /**
     * Descifrar con RSA-OAEP usando llave privada
     * @param {string} encryptedDataBase64 - Datos cifrados en base64
     * @param {string} privateKeyBase64 - Llave privada en base64
     */
    static decryptRSA(encryptedDataBase64, privateKeyBase64) {
        try {
            // Convertir las llaves y datos de base64
            const privateKeyPem = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
            const encryptedBuffer = Buffer.from(encryptedDataBase64, 'base64');

            // Descifrar usando RSA-OAEP
            const decrypted = crypto.privateDecrypt(
                {
                    key: privateKeyPem,
                    oaepHash: 'sha256',
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
                },
                encryptedBuffer
            );

            return {
                decryptedData: decrypted.toString('utf8'),
                algorithm: 'RSA-OAEP'
            };
        } catch (error) {
            throw new Error(`Error al descifrar con RSA: ${error.message}`);
        }
    }

    /**
     * Generar par de llaves DSA
     * @param {number} modulusLength - Tamaño del módulo (default: 2048)
     */
    static generateDSAKeyPair(modulusLength = 2048) {
        try {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('dsa', {
                modulusLength: modulusLength,
                divisorLength: 256, // Tamaño del divisor q
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
            const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

            return {
                publicKey: publicKeyBase64,
                privateKey: privateKeyBase64,
                algorithm: 'DSA',
                keySize: modulusLength
            };
        } catch (error) {
            throw new Error(`Error generando llaves DSA: ${error.message}`);
        }
    }

    /**
     * Generar par de llaves ECDSA (Alternativa moderna a DSA)
     * @param {string} namedCurve - Curva elíptica a usar (default: 'prime256v1')
     */
    static generateECDSAKeyPair(namedCurve = 'prime256v1') {
        try {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
                namedCurve: namedCurve, // prime256v1, secp384r1, secp521r1
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
            const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

            return {
                publicKey: publicKeyBase64,
                privateKey: privateKeyBase64,
                algorithm: 'ECDSA',
                curve: namedCurve
            };
        } catch (error) {
            throw new Error(`Error generando llaves ECDSA: ${error.message}`);
        }
    }

    /**
     * Firmar mensaje con DSA
     * @param {string} message - Mensaje a firmar
     * @param {string} privateKeyBase64 - Llave privada en base64
     * @param {string} algorithm - Algoritmo a usar ('DSA' o 'ECDSA')
     */
    static signMessage(message, privateKeyBase64, algorithm = 'DSA') {
        try {
            const privateKeyPem = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
            
            // Crear el objeto de firma
            const sign = crypto.createSign('SHA256');
            sign.update(message);
            sign.end();

            // Firmar el mensaje
            const signature = sign.sign(privateKeyPem);

            return {
                signature: signature.toString('base64'),
                message: message,
                algorithm: algorithm,
                hashAlgorithm: 'SHA-256'
            };
        } catch (error) {
            throw new Error(`Error al firmar mensaje: ${error.message}`);
        }
    }

    /**
     * Verificar firma DSA/ECDSA
     * @param {string} message - Mensaje original
     * @param {string} signatureBase64 - Firma en base64
     * @param {string} publicKeyBase64 - Llave pública en base64
     */
    static verifySignature(message, signatureBase64, publicKeyBase64) {
        try {
            const publicKeyPem = Buffer.from(publicKeyBase64, 'base64').toString('utf8');
            const signatureBuffer = Buffer.from(signatureBase64, 'base64');

            // Crear el objeto de verificación
            const verify = crypto.createVerify('SHA256');
            verify.update(message);
            verify.end();

            // Verificar la firma
            const isValid = verify.verify(publicKeyPem, signatureBuffer);

            return {
                isValid: isValid,
                message: message,
                verified: isValid ? 'Firma válida' : 'Firma inválida'
            };
        } catch (error) {
            throw new Error(`Error al verificar firma: ${error.message}`);
        }
    }

    /**
     * Cifrar y firmar (híbrido)
     * Combina cifrado RSA con firma DSA/ECDSA para confidencialidad y autenticación
     */
    static encryptAndSign(text, recipientPublicKeyRSA, senderPrivateKeyDSA) {
        try {
            // 1. Cifrar el mensaje con la llave pública RSA del destinatario
            const encrypted = this.encryptRSA(text, recipientPublicKeyRSA);
            
            // 2. Firmar el mensaje cifrado con la llave privada DSA del remitente
            const signature = this.signMessage(encrypted.encryptedData, senderPrivateKeyDSA);

            return {
                encryptedData: encrypted.encryptedData,
                signature: signature.signature,
                algorithm: {
                    encryption: 'RSA-OAEP',
                    signature: 'DSA/ECDSA'
                }
            };
        } catch (error) {
            throw new Error(`Error en cifrado y firma: ${error.message}`);
        }
    }

    /**
     * Verificar y descifrar (híbrido)
     * Verifica la firma y luego descifra el mensaje
     */
    static verifyAndDecrypt(encryptedData, signature, senderPublicKeyDSA, recipientPrivateKeyRSA) {
        try {
            // 1. Verificar la firma con la llave pública DSA del remitente
            const verification = this.verifySignature(encryptedData, signature, senderPublicKeyDSA);
            
            if (!verification.isValid) {
                throw new Error('La firma no es válida. El mensaje podría haber sido alterado.');
            }

            // 2. Descifrar el mensaje con la llave privada RSA del destinatario
            const decrypted = this.decryptRSA(encryptedData, recipientPrivateKeyRSA);

            return {
                decryptedData: decrypted.decryptedData,
                signatureValid: true,
                algorithm: {
                    encryption: 'RSA-OAEP',
                    signature: 'DSA/ECDSA'
                }
            };
        } catch (error) {
            throw new Error(`Error en verificación y descifrado: ${error.message}`);
        }
    }
}

module.exports = AsymmetricService;