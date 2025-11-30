const crypto = require('crypto');

// Función auxiliar para convertir Buffer a Base64 (Requisito )
const toBase64 = (buffer) => buffer.toString('base64');
// Función auxiliar para convertir Base64 a Buffer
const fromBase64 = (string) => Buffer.from(string, 'base64');

const cryptoService = {
    // --- AES-256-CBC ---
    aesEncrypt: (text) => {
        // 1. Generar clave (32 bytes) y IV (16 bytes) aleatorios
        const key = crypto.randomBytes(32); 
        const iv = crypto.randomBytes(16); 

        // 2. Crear el cifrador
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        
        // 3. Cifrar
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        // 4. Retornar todo en Base64 
        return {
            ciphertext: encrypted,
            key: toBase64(key),
            iv: toBase64(iv),
            algorithm: 'aes-256-cbc'
        };
    },

    aesDecrypt: (ciphertext, keyBase64, ivBase64) => {
        // 1. Convertir los inputs de Base64 a Buffers binarios
        const key = fromBase64(keyBase64);
        const iv = fromBase64(ivBase64);

        // 2. Crear el descifrador
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // 3. Descifrar
        let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    },

    // --- ChaCha20-Poly1305 ---
    chachaEncrypt: (text) => {
        // ChaCha20 usa una clave de 32 bytes y un Nonce de 12 bytes
        const key = crypto.randomBytes(32);
        const nonce = crypto.randomBytes(12);

        // Usamos chacha20-poly1305 que incluye autenticación (standard moderno)
        const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce);

        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        
        // Poly1305 genera un "Auth Tag" para verificar integridad
        const authTag = cipher.getAuthTag();

        return {
            ciphertext: encrypted,
            key: toBase64(key),
            nonce: toBase64(nonce),
            authTag: toBase64(authTag), // Importante para ChaCha20
            algorithm: 'chacha20-poly1305'
        };
    },

    chachaDecrypt: (ciphertext, keyBase64, nonceBase64, authTagBase64) => {
        const key = fromBase64(keyBase64);
        const nonce = fromBase64(nonceBase64);
        const authTag = fromBase64(authTagBase64);

        const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce);
        
        // Establecer el Auth Tag antes de descifrar para verificar integridad
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
};

module.exports = cryptoService;