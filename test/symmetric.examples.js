/**
 * Ejemplos de uso de los endpoints de Cifrado Simétrico
 * Puedes usar estos ejemplos con herramientas como Postman, Thunder Client o curl
 */

// ===========================================
// 1. GENERAR UNA LLAVE
// ===========================================
// GET http://localhost:3000/api/encrypt/generate-key
// Response:
// {
//   "success": true,
//   "message": "Llave de 256 bits generada correctamente",
//   "data": {
//     "key": "Xk7B9Zc3Hf5Nm8Qw2Rt6Yu1Io4Pa0Sd=",
//     "description": "Llave en base64 para usar con AES-256 o ChaCha20"
//   }
// }

// ===========================================
// 2. CIFRADO AES-256-CBC
// ===========================================
// POST http://localhost:3000/api/encrypt/aes_cbc
const aesEncryptExample = {
    "text": "Este es un mensaje secreto que queremos cifrar",
    "key": "Xk7B9Zc3Hf5Nm8Qw2Rt6Yu1Io4Pa0Sd/Fg2Lk9Mn3Bv=" // Debe ser exactamente 32 bytes en base64
};
// Response:
// {
//   "success": true,
//   "message": "Texto cifrado correctamente con AES-256-CBC",
//   "data": {
//     "iv": "1a2b3c4d5e6f7g8h9i0j=",
//     "encryptedData": "U2FsdGVkX1+...",
//     "algorithm": "AES-256-CBC"
//   }
// }

// ===========================================
// 3. DESCIFRADO AES-256-CBC
// ===========================================
// POST http://localhost:3000/api/decrypt/aes_cbc
const aesDecryptExample = {
    "encryptedData": "U2FsdGVkX1+...", // Del paso anterior
    "key": "Xk7B9Zc3Hf5Nm8Qw2Rt6Yu1Io4Pa0Sd/Fg2Lk9Mn3Bv=",
    "iv": "1a2b3c4d5e6f7g8h9i0j=" // Del paso anterior
};
// Response:
// {
//   "success": true,
//   "message": "Texto descifrado correctamente con AES-256-CBC",
//   "data": {
//     "decryptedData": "Este es un mensaje secreto que queremos cifrar",
//     "algorithm": "AES-256-CBC"
//   }
// }

// ===========================================
// 4. CIFRADO ChaCha20-Poly1305
// ===========================================
// POST http://localhost:3000/api/encrypt/chacha20
const chachaEncryptExample = {
    "text": "Información confidencial para cifrar con ChaCha20",
    "key": "Xk7B9Zc3Hf5Nm8Qw2Rt6Yu1Io4Pa0Sd/Fg2Lk9Mn3Bv="
};
// Response:
// {
//   "success": true,
//   "message": "Texto cifrado correctamente con ChaCha20-Poly1305",
//   "data": {
//     "nonce": "abc123def456",
//     "authTag": "xyz789uvw012",
//     "encryptedData": "ChaCha20EncryptedData...",
//     "algorithm": "ChaCha20-Poly1305"
//   }
// }

// ===========================================
// 5. DESCIFRADO ChaCha20-Poly1305
// ===========================================
// POST http://localhost:3000/api/decrypt/chacha20
const chachaDecryptExample = {
    "encryptedData": "ChaCha20EncryptedData...",
    "key": "Xk7B9Zc3Hf5Nm8Qw2Rt6Yu1Io4Pa0Sd/Fg2Lk9Mn3Bv=",
    "nonce": "abc123def456",
    "authTag": "xyz789uvw012"
};
// Response:
// {
//   "success": true,
//   "message": "Texto descifrado correctamente con ChaCha20-Poly1305",
//   "data": {
//     "decryptedData": "Información confidencial para cifrar con ChaCha20",
//     "algorithm": "ChaCha20-Poly1305"
//   }
// }

// ===========================================
// 6. DIFFIE-HELLMAN - PARTICIPANTE A
// ===========================================
// POST http://localhost:3000/api/encrypt/diffie-hellman/init
const dhInitExample = {
    "sessionId": "session-123-unique-id"
};
// Response:
// {
//   "success": true,
//   "message": "Parámetros Diffie-Hellman generados",
//   "data": {
//     "sessionId": "session-123-unique-id",
//     "publicKey": "MIIBIjANBgkqhkiG9w0B...",
//     "prime": "//////////yQ/aoiFowjTExm...",
//     "generator": "Ag==",
//     "instructions": "Comparte estos parámetros con el otro participante y recibe su llave pública"
//   }
// }

// ===========================================
// 7. DIFFIE-HELLMAN - PARTICIPANTE B
// ===========================================
// POST http://localhost:3000/api/encrypt/diffie-hellman/complete
const dhCompleteExample = {
    "sessionId": "session-456-other-user",
    "otherPublicKey": "MIIBIjANBgkqhkiG9w0B...", // Llave pública del Participante A
    "prime": "//////////yQ/aoiFowjTExm...", // Prime del Participante A
    "generator": "Ag==" // Generator del Participante A
};
// Response:
// {
//   "success": true,
//   "message": "Llave compartida calculada correctamente",
//   "data": {
//     "sharedKey": "SharedSecretKey123...",
//     "myPublicKey": "MyPublicKey456...",
//     "description": "Esta es tu llave compartida derivada del intercambio Diffie-Hellman"
//   }
// }

// ===========================================
// CASOS DE USO Y MEJORES PRÁCTICAS
// ===========================================

console.log(`
📚 GUÍA DE USO DE CIFRADO SIMÉTRICO

1. AES-256-CBC:
   ✅ Ideal para: Cifrado de archivos grandes, datos en reposo
   ✅ Ventajas: Ampliamente soportado, muy estudiado, hardware acceleration
   ⚠️  Requiere: Padding, vulnerable a padding oracle attacks si no se implementa correctamente
   
2. ChaCha20-Poly1305:
   ✅ Ideal para: Comunicaciones en tiempo real, dispositivos móviles
   ✅ Ventajas: Más rápido en software, incluye autenticación (AEAD)
   ✅ Seguridad: Resistente a timing attacks
   
3. Diffie-Hellman:
   ✅ Ideal para: Establecer llaves compartidas sobre canales inseguros
   ⚠️  Importante: Usar con autenticación para evitar MITM attacks
   
NOTAS DE SEGURIDAD:
- NUNCA reutilices IVs/Nonces con la misma llave
- Siempre valida la integridad de los datos (authTag en ChaCha20)
- Las llaves deben ser generadas aleatoriamente, no derivadas de passwords débiles
- En producción, usar HTTPS para todas las comunicaciones
- Implementar rate limiting para prevenir ataques de fuerza bruta
`);

// ===========================================
// EJEMPLO DE FLUJO COMPLETO
// ===========================================

async function ejemploFlujoCompleto() {
    const axios = require('axios');
    const baseURL = 'http://localhost:3000/api';
    
    try {
        // 1. Generar una llave
        console.log('1. Generando llave...');
        const keyResponse = await axios.get(`${baseURL}/encrypt/generate-key`);
        const key = keyResponse.data.data.key;
        console.log('   Llave generada:', key);
        
        // 2. Cifrar con AES
        console.log('\n2. Cifrando con AES-256-CBC...');
        const encryptResponse = await axios.post(`${baseURL}/encrypt/aes_cbc`, {
            text: 'Mensaje ultra secreto',
            key: key
        });
        const { iv, encryptedData } = encryptResponse.data.data;
        console.log('   Texto cifrado:', encryptedData);
        console.log('   IV:', iv);
        
        // 3. Descifrar
        console.log('\n3. Descifrando...');
        const decryptResponse = await axios.post(`${baseURL}/decrypt/aes_cbc`, {
            encryptedData,
            key,
            iv
        });
        console.log('   Texto descifrado:', decryptResponse.data.data.decryptedData);
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Descomentar para ejecutar el ejemplo
// ejemploFlujoCompleto();

module.exports = {
    aesEncryptExample,
    aesDecryptExample,
    chachaEncryptExample,
    chachaDecryptExample,
    dhInitExample,
    dhCompleteExample
};