/**
 * Ejemplos de uso de los endpoints de Cifrado Asimétrico
 * RSA-OAEP para cifrado y DSA/ECDSA para firma digital
 */

// ===========================================
// 1. GENERAR LLAVES RSA (para cifrado)
// ===========================================
// POST http://localhost:3000/api/generate/rsa
const generateRSAExample = {
    "keySize": 2048,  // Opciones: 2048, 3072, 4096
    "userId": "user123" // Opcional, para almacenar temporalmente
};
// Response:
// {
//   "success": true,
//   "message": "Par de llaves RSA generado correctamente",
//   "data": {
//     "publicKey": "LS0tLS1CRUdJTi...",
//     "privateKey": "LS0tLS1CRUdJTi...",
//     "algorithm": "RSA",
//     "keySize": 2048
//   }
// }

// ===========================================
// 2. GENERAR LLAVES DSA (para firma)
// ===========================================
// POST http://localhost:3000/api/generate/dsa
const generateDSAExample = {
    "keySize": 2048,  // Opciones: 1024, 2048, 3072
    "userId": "user123"
};

// ===========================================
// 3. GENERAR LLAVES ECDSA (alternativa moderna a DSA)
// ===========================================
// POST http://localhost:3000/api/generate/ecdsa
const generateECDSAExample = {
    "curve": "prime256v1",  // Opciones: prime256v1, secp384r1, secp521r1
    "userId": "user123"
};

// ===========================================
// 4. CIFRAR CON RSA-OAEP
// ===========================================
// POST http://localhost:3000/api/encrypt/rsa
const rsaEncryptExample = {
    "text": "Mensaje confidencial para cifrar con RSA",
    "publicKey": "LS0tLS1CRUdJTi..." // Llave pública del destinatario en base64
};
// Response:
// {
//   "success": true,
//   "message": "Texto cifrado correctamente con RSA-OAEP",
//   "data": {
//     "encryptedData": "encrypted_base64_string...",
//     "algorithm": "RSA-OAEP",
//     "hashAlgorithm": "SHA-256"
//   }
// }

// ===========================================
// 5. DESCIFRAR CON RSA-OAEP
// ===========================================
// POST http://localhost:3000/api/decrypt/rsa
const rsaDecryptExample = {
    "encryptedData": "encrypted_base64_string...",
    "privateKey": "LS0tLS1CRUdJTi..." // Tu llave privada en base64
};

// ===========================================
// 6. FIRMAR CON DSA/ECDSA
// ===========================================
// POST http://localhost:3000/api/sign/dsa
const dsaSignExample = {
    "message": "Este es un documento importante que necesita ser firmado",
    "privateKey": "LS0tLS1CRUdJTi...", // Tu llave privada DSA/ECDSA
    "algorithm": "DSA" // o "ECDSA"
};
// Response:
// {
//   "success": true,
//   "message": "Mensaje firmado correctamente con DSA",
//   "data": {
//     "signature": "signature_base64...",
//     "message": "Este es un documento importante...",
//     "algorithm": "DSA",
//     "hashAlgorithm": "SHA-256"
//   }
// }

// ===========================================
// 7. VERIFICAR FIRMA DSA/ECDSA
// ===========================================
// POST http://localhost:3000/api/verify/dsa
const dsaVerifyExample = {
    "message": "Este es un documento importante que necesita ser firmado",
    "signature": "signature_base64...",
    "publicKey": "LS0tLS1CRUdJTi..." // Llave pública del firmante
};
// Response:
// {
//   "success": true,
//   "message": "Verificación de firma completada",
//   "data": {
//     "isValid": true,
//     "message": "Este es un documento importante...",
//     "verified": "Firma válida"
//   }
// }

// ===========================================
// 8. OPERACIÓN HÍBRIDA: CIFRAR Y FIRMAR
// ===========================================
// POST http://localhost:3000/api/hybrid/encrypt-sign
const encryptAndSignExample = {
    "text": "Mensaje ultra secreto y autenticado",
    "recipientPublicKeyRSA": "LS0tLS1CRUdJTi...", // Llave pública RSA del destinatario
    "senderPrivateKeyDSA": "LS0tLS1CRUdJTi..." // Tu llave privada DSA/ECDSA
};
// Response:
// {
//   "success": true,
//   "message": "Mensaje cifrado y firmado correctamente",
//   "data": {
//     "encryptedData": "encrypted_base64...",
//     "signature": "signature_base64...",
//     "algorithm": {
//       "encryption": "RSA-OAEP",
//       "signature": "DSA/ECDSA"
//     }
//   }
// }

// ===========================================
// 9. OPERACIÓN HÍBRIDA: VERIFICAR Y DESCIFRAR
// ===========================================
// POST http://localhost:3000/api/hybrid/verify-decrypt
const verifyAndDecryptExample = {
    "encryptedData": "encrypted_base64...",
    "signature": "signature_base64...",
    "senderPublicKeyDSA": "LS0tLS1CRUdJTi...", // Llave pública DSA del remitente
    "recipientPrivateKeyRSA": "LS0tLS1CRUdJTi..." // Tu llave privada RSA
};

// ===========================================
// FLUJO COMPLETO DE EJEMPLO
// ===========================================

async function ejemploCifradoAsimetrico() {
    const axios = require('axios');
    const baseURL = 'http://localhost:3000/api';
    
    try {
        console.log('=== EJEMPLO DE CIFRADO ASIMÉTRICO ===\n');
        
        // 1. Alice genera sus llaves RSA
        console.log('1. Alice genera sus llaves RSA...');
        const aliceRSA = await axios.post(`${baseURL}/generate/rsa`, { keySize: 2048 });
        const aliceRSAKeys = aliceRSA.data.data;
        console.log('   ✓ Llaves RSA de Alice generadas');
        
        // 2. Alice genera sus llaves DSA para firma
        console.log('\n2. Alice genera sus llaves DSA para firma...');
        const aliceDSA = await axios.post(`${baseURL}/generate/dsa`, { keySize: 2048 });
        const aliceDSAKeys = aliceDSA.data.data;
        console.log('   ✓ Llaves DSA de Alice generadas');
        
        // 3. Bob genera sus llaves RSA
        console.log('\n3. Bob genera sus llaves RSA...');
        const bobRSA = await axios.post(`${baseURL}/generate/rsa`, { keySize: 2048 });
        const bobRSAKeys = bobRSA.data.data;
        console.log('   ✓ Llaves RSA de Bob generadas');
        
        // 4. Bob genera sus llaves DSA
        console.log('\n4. Bob genera sus llaves DSA para firma...');
        const bobDSA = await axios.post(`${baseURL}/generate/dsa`, { keySize: 2048 });
        const bobDSAKeys = bobDSA.data.data;
        console.log('   ✓ Llaves DSA de Bob generadas');
        
        // 5. Alice envía un mensaje cifrado y firmado a Bob
        console.log('\n5. Alice cifra y firma un mensaje para Bob...');
        const mensaje = 'Hola Bob, este es un mensaje secreto de Alice';
        
        const mensajeCifradoFirmado = await axios.post(`${baseURL}/hybrid/encrypt-sign`, {
            text: mensaje,
            recipientPublicKeyRSA: bobRSAKeys.publicKey,  // Llave pública de Bob
            senderPrivateKeyDSA: aliceDSAKeys.privateKey  // Llave privada de Alice
        });
        
        const { encryptedData, signature } = mensajeCifradoFirmado.data.data;
        console.log('   ✓ Mensaje cifrado y firmado');
        console.log(`   Datos cifrados: ${encryptedData.substring(0, 50)}...`);
        console.log(`   Firma: ${signature.substring(0, 50)}...`);
        
        // 6. Bob verifica y descifra el mensaje
        console.log('\n6. Bob verifica la firma y descifra el mensaje...');
        const mensajeDescifrado = await axios.post(`${baseURL}/hybrid/verify-decrypt`, {
            encryptedData: encryptedData,
            signature: signature,
            senderPublicKeyDSA: aliceDSAKeys.publicKey,  // Llave pública de Alice
            recipientPrivateKeyRSA: bobRSAKeys.privateKey // Llave privada de Bob
        });
        
        console.log('   ✓ Firma verificada y mensaje descifrado');
        console.log(`   Mensaje original: "${mensajeDescifrado.data.data.decryptedData}"`);
        console.log(`   Firma válida: ${mensajeDescifrado.data.data.signatureValid}`);
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// ===========================================
// CASOS DE USO Y MEJORES PRÁCTICAS
// ===========================================

console.log(`
📚 GUÍA DE USO DE CIFRADO ASIMÉTRICO

1. RSA-OAEP (Cifrado):
   ✅ Ideal para: Intercambio seguro de llaves, mensajes cortos
   ✅ Ventajas: No requiere canal seguro previo
   ⚠️  Limitación: Solo puede cifrar ~190 bytes con RSA-2048
   💡 Solución: Usar cifrado híbrido (RSA + AES) para mensajes largos
   
2. DSA (Firma Digital):
   ✅ Ideal para: Autenticación de documentos, integridad de datos
   ✅ Ventajas: Firma más rápida que RSA
   ⚠️  Nota: DSA solo firma, no cifra
   
3. ECDSA (Firma Digital Moderna):
   ✅ Ideal para: Mismos casos que DSA pero con llaves más pequeñas
   ✅ Ventajas: Mayor seguridad con llaves más cortas
   ✅ Curvas: prime256v1 (256 bits ≈ RSA-3072)
   
4. Operaciones Híbridas:
   ✅ Cifrar + Firmar: Confidencialidad + Autenticación
   ✅ Proceso:
      1. Cifrar con llave pública del destinatario (confidencialidad)
      2. Firmar con llave privada del remitente (autenticación)
      3. El destinatario verifica y luego descifra
   
NOTAS DE SEGURIDAD:
- NUNCA compartir llaves privadas
- Verificar SIEMPRE las firmas antes de confiar en el contenido
- Usar tamaños de llave apropiados (mínimo RSA-2048, DSA-2048)
- En producción, almacenar llaves privadas cifradas
- Implementar gestión adecuada del ciclo de vida de las llaves
- Considerar usar HSM (Hardware Security Module) para llaves críticas

COMPARACIÓN RSA vs DSA/ECDSA:
┌─────────────┬──────────────┬─────────────────┐
│ Algoritmo   │ Cifrado      │ Firma Digital   │
├─────────────┼──────────────┼─────────────────┤
│ RSA         │ ✅ Sí        │ ✅ Sí           │
│ DSA         │ ❌ No        │ ✅ Sí           │
│ ECDSA       │ ❌ No        │ ✅ Sí           │
└─────────────┴──────────────┴─────────────────┘
`);

// Descomentar para ejecutar el ejemplo
// ejemploCifradoAsimetrico();

module.exports = {
    generateRSAExample,
    generateDSAExample,
    generateECDSAExample,
    rsaEncryptExample,
    rsaDecryptExample,
    dsaSignExample,
    dsaVerifyExample,
    encryptAndSignExample,
    verifyAndDecryptExample
};