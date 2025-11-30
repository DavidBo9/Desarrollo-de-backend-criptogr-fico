const crypto = require('crypto');

/**
 * Servicio de Cifrado Simétrico
 * Implementa AES-256-CBC y ChaCha20-Poly1305
 */

class CryptoService {
    /**
     * Cifrado AES-256-CBC
     */
    static encryptAES256CBC(text, key) {
        try {
            // Generar un IV (Vector de Inicialización) aleatorio
            const iv = crypto.randomBytes(16);
            
            // Asegurar que la llave tenga el tamaño correcto (32 bytes para AES-256)
            const keyBuffer = Buffer.from(key, 'base64');
            if (keyBuffer.length !== 32) {
                throw new Error('La llave debe ser de 32 bytes (256 bits) para AES-256');
            }

            // Crear el cifrador
            const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
            
            // Cifrar el texto
            let encrypted = cipher.update(text, 'utf8');
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            
            // Retornar el IV y el texto cifrado en base64
            return {
                iv: iv.toString('base64'),
                encryptedData: encrypted.toString('base64'),
                algorithm: 'AES-256-CBC'
            };
        } catch (error) {
            throw new Error(`Error al cifrar con AES-256-CBC: ${error.message}`);
        }
    }

    /**
     * Descifrado AES-256-CBC
     */
    static decryptAES256CBC(encryptedData, key, iv) {
        try {
            // Convertir de base64 a buffer
            const keyBuffer = Buffer.from(key, 'base64');
            const ivBuffer = Buffer.from(iv, 'base64');
            const encryptedBuffer = Buffer.from(encryptedData, 'base64');
            
            // Validar tamaño de llave
            if (keyBuffer.length !== 32) {
                throw new Error('La llave debe ser de 32 bytes (256 bits) para AES-256');
            }

            // Crear el descifrador
            const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
            
            // Descifrar
            let decrypted = decipher.update(encryptedBuffer);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            
            return {
                decryptedData: decrypted.toString('utf8'),
                algorithm: 'AES-256-CBC'
            };
        } catch (error) {
            throw new Error(`Error al descifrar con AES-256-CBC: ${error.message}`);
        }
    }

    /**
     * Cifrado ChaCha20-Poly1305
     */
    static encryptChaCha20(text, key) {
        try {
            // Generar un nonce aleatorio (12 bytes para ChaCha20-Poly1305)
            const nonce = crypto.randomBytes(12);
            
            // Asegurar que la llave tenga el tamaño correcto (32 bytes)
            const keyBuffer = Buffer.from(key, 'base64');
            if (keyBuffer.length !== 32) {
                throw new Error('La llave debe ser de 32 bytes (256 bits) para ChaCha20');
            }

            // Crear el cifrador
            const cipher = crypto.createCipheriv('chacha20-poly1305', keyBuffer, nonce);
            
            // Cifrar el texto
            let encrypted = cipher.update(text, 'utf8');
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            
            // Obtener el tag de autenticación
            const authTag = cipher.getAuthTag();
            
            // Retornar el nonce, tag y texto cifrado en base64
            return {
                nonce: nonce.toString('base64'),
                authTag: authTag.toString('base64'),
                encryptedData: encrypted.toString('base64'),
                algorithm: 'ChaCha20-Poly1305'
            };
        } catch (error) {
            throw new Error(`Error al cifrar con ChaCha20: ${error.message}`);
        }
    }

    /**
     * Descifrado ChaCha20-Poly1305
     */
    static decryptChaCha20(encryptedData, key, nonce, authTag) {
        try {
            // Convertir de base64 a buffer
            const keyBuffer = Buffer.from(key, 'base64');
            const nonceBuffer = Buffer.from(nonce, 'base64');
            const authTagBuffer = Buffer.from(authTag, 'base64');
            const encryptedBuffer = Buffer.from(encryptedData, 'base64');
            
            // Validar tamaño de llave
            if (keyBuffer.length !== 32) {
                throw new Error('La llave debe ser de 32 bytes (256 bits) para ChaCha20');
            }

            // Crear el descifrador
            const decipher = crypto.createDecipheriv('chacha20-poly1305', keyBuffer, nonceBuffer);
            
            // Establecer el tag de autenticación
            decipher.setAuthTag(authTagBuffer);
            
            // Descifrar
            let decrypted = decipher.update(encryptedBuffer);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            
            return {
                decryptedData: decrypted.toString('utf8'),
                algorithm: 'ChaCha20-Poly1305'
            };
        } catch (error) {
            throw new Error(`Error al descifrar con ChaCha20: ${error.message}`);
        }
    }

    /**
     * Generar una llave aleatoria de 256 bits
     */
    static generateKey() {
        return crypto.randomBytes(32).toString('base64');
    }

    /**
     * Implementación de Diffie-Hellman para intercambio de llaves
     */
    static generateDiffieHellman() {
        // Crear un nuevo objeto Diffie-Hellman con un primo de 2048 bits
        const dh = crypto.createDiffieHellman(2048);
        
        // Generar las llaves del participante
        const publicKey = dh.generateKeys('base64');
        const prime = dh.getPrime('base64');
        const generator = dh.getGenerator('base64');
        
        return {
            publicKey,
            prime,
            generator,
            dhObject: dh // Guardamos el objeto para calcular el secreto compartido después
        };
    }

    /**
     * Calcular secreto compartido usando Diffie-Hellman
     */
    static computeSharedSecret(dhParams, otherPublicKey) {
        try {
            // Reconstruir el objeto DH con los parámetros
            const dh = crypto.createDiffieHellman(
                Buffer.from(dhParams.prime, 'base64'),
                Buffer.from(dhParams.generator, 'base64')
            );
            
            // Establecer las llaves propias
            dh.setPrivateKey(Buffer.from(dhParams.privateKey, 'base64'));
            dh.setPublicKey(Buffer.from(dhParams.publicKey, 'base64'));
            
            // Calcular el secreto compartido
            const sharedSecret = dh.computeSecret(Buffer.from(otherPublicKey, 'base64'));
            
            // Derivar una llave de 256 bits del secreto compartido usando HKDF
            const key = crypto.createHash('sha256').update(sharedSecret).digest();
            
            return key.toString('base64');
        } catch (error) {
            throw new Error(`Error en Diffie-Hellman: ${error.message}`);
        }
    }
}

module.exports = CryptoService;