# 🔐 Desarrollo de Backend Criptográfico

## Descripción del Proyecto

Proyecto para implementar diferentes algoritmos de encriptado asegurando la comprensión del uso práctico y los casos de uso adecuados.

Este backend expone una API REST con funcionalidades de:
* **Gestión de Usuarios:** Con hashing seguro de contraseñas.
* **Cifrado Simétrico:** Implementación de AES-256-CBC y ChaCha20-Poly1305.
* **Cifrado Asimétrico:** Implementación de RSA, DSA y ECDSA.
* **Funciones Hash:** SHA256 y Argon2.

## 🚀 Endpoints y Ejemplos de Petición (Body)

La URL base para todas las peticiones es **`http://localhost:3000/api`**.
Asegúrate de configurar el **Content-Type** como `application/json` en Postman.

---

### 1. 🧑‍💻 Usuarios (Requiere conexión a MongoDB)

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Crear Usuario** | `POST` | `/users/add` | `{"username": "testuser", "password": "SecurePassword123"}` |
| Listar Todos | `GET` | `/users/all` | **(No Body requerido)** |
| Actualizar | `PUT` | `/users/update/:id` | **(Body depende de los campos a actualizar)** |
| Eliminar | `DELETE` | `/users/delete/:id` | **(No Body requerido)** |

---

### 2. 🧮 Funciones Hash (Requiere implementar el controlador)

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **SHA-256** | `POST` | `/hash/sha256` | `{"text": "El mensaje secreto"}` |
| **Argon2 (Hash)** | `POST` | `/hash/argon2` | `{"password": "passwordSeguro123"}` |
| **Argon2 (Verify)** | `POST` | `/hash/verify/argon2` | `{"password": "passwordSeguro123", "hash": "<HASH_RECIBIDO_DE_LA_PETICIÓN_ANTERIOR>"}` |

---

### 3. 🔑 Cifrado Simétrico (Symmetric Crypto)

* **NOTA:** Los campos `text`, `encryptedData`, `key`, `iv`, `nonce` y `authTag` deben ser enviados en formato **Base64**.

#### AES-256-CBC

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Cifrar** | `POST` | `/encrypt/aes_cbc` | `{"text": "Mensaje Secreto"}` |
| **Descifrar** | `POST` | `/decrypt/aes_cbc` | `{"ciphertext": "<DATA_BASE64>", "key": "<LLAVE_BASE64>", "iv": "<IV_BASE64>"}` |

#### ChaCha20-Poly1305

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Cifrar** | `POST` | `/encrypt/chacha20` | `{"text": "Mensaje Secreto"}` |
| **Descifrar** | `POST` | `/decrypt/chacha20` | `{"cipherText": "<DATA_BASE64>", "key": "<LLAVE_BASE64>", "nonce": "<NONCE_BASE64>", "authTag": "<TAG_BASE64>"}` |
---

### 4. 🔒 Cifrado Asimétrico (Asymmetric Crypto)

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Generar RSA** | `POST` | `/generate/rsa` | `{"modulusLength": 2048}` |
| **Generar DSA** | `POST` | `/generate/dsa` | `{"modulusLength": 2048}` |
| **Generar ECDSA** | `POST` | `/generate/ecdsa` | `{"modulusLength": 2048}` |
| **Cifrar RSA** | `POST` | `/encrypt/rsa` | `{"text": "Dato Confidencial", "publicKey": "<RSA_PUBLIC_KEY>"}` |
| **Descifrar RSA** | `POST` | `/decrypt/rsa` | `{"encryptedData": "<DATA_ENCRIPTADA>", "privateKey": "<RSA_PRIVATE_KEY>"}` |
| **Firmar DSA/ECDSA** | `POST` | `/sign/dsa` | `{"message": "Documento importante", "privateKey": "<DSA_PRIVATE_KEY>", "algorithm": "DSA"}` |
| **Verificar DSA/ECDSA** | `POST` | `/verify/dsa` | `{"message": "Documento importante", "signature": "<FIRMA_BASE64>", "publicKey": "<DSA_PUBLIC_KEY>"}` |

## 📁 Estructura del Proyecto

```
desarrollo-de-backend-criptografico/
│
├── 📁 controllers/
│   ├── user.controller.js          # CRUD de usuarios
│   ├── hash.controller.js          # Controlador funciones hash
│   ├── symmetric.controller.js     # Controlador cifrado simétrico
│   └── asymmetric.controller.js    # Controlador cifrado asimétrico

│   
├── 📁 models/
│   └── user.model.js               # Modelo de usuario MongoDB
│
├── 📁 routes/
│   ├── user.route.js               # Rutas de usuarios
│   ├── hash.route.js               # Rutas funciones hash
│   ├── symmetric.route.js          # Rutas cifrado simétrico
│   └── asymmetric.route.js         # Rutas cifrado asimétrico
│
├── 📁 services/
│   ├── hashService.js              # Lógica SHA-256, Argon2
│   ├── symmetricService.js         # Lógica AES, ChaCha20
│   └── asymmetricService.js        # Lógica RSA, DSA, ECDSA
│
│
├── app.js                          # Aplicación principal Express
├── .env.example                    # Variables de entorno ejemplo
├── .gitignore                      # Archivos ignorados por Git
├── package.json                    # Dependencias y scripts
├── package-lock.json              # Lock de dependencias
└── README.md                       # Este archivo
```

## 🚀 Instalación

### Prerequisitos
- Node.js v14+ 
- MongoDB v4.4+ (local o MongoDB Atlas)
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/DavidBo9/Desarrollo-de-backend-criptografico.git
cd desarrollo-de-backend-criptografico

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración de MongoDB

# 4. Iniciar MongoDB (si es local)
mongod

# 5. Iniciar el servidor
npm start

# Para desarrollo con hot-reload
npm run dev
```

## 🗄️ Configuración de MongoDB

### Opción 1: MongoDB Local

1. Instalar MongoDB Community Edition:
   - [Descargar MongoDB](https://www.mongodb.com/try/download/community)

2. Iniciar el servicio:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# o
brew services start mongodb-community
```

3. La URI por defecto es:
```
mongodb://localhost:27017/crypto-backend
```

### Opción 2: MongoDB Atlas (Cloud)

1. Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Crear un cluster gratuito (M0 Sandbox)

3. Configurar acceso:
   - Agregar tu IP a la whitelist
   - Crear usuario de base de datos

4. Obtener la URI de conexión:
```
mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/crypto-backend?retryWrites=true&w=majority
```

5. Actualizar el archivo `.env`:
```env
MONGODB_URI=mongodb+srv://tuUsuario:tuPassword@cluster.xxxxx.mongodb.net/crypto-backend?retryWrites=true&w=majority
```

### Verificar conexión

```bash
# El servidor mostrará:
✅ Conexión a MongoDB exitosa
📦 Base de datos: crypto-backend
```

## 📋 Endpoints Disponibles

### Base URL
```
http://localhost:3000
```

### Documentación completa de endpoints

| Categoría | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| **Health** | GET | `/` | Información de la API |
| **Health** | GET | `/health` | Estado del servidor |
| **Usuarios** | GET | `/api/users/all` | Obtener todos los usuarios |
| **Usuarios** | POST | `/api/users/add` | Crear usuario |
| **Usuarios** | PUT | `/api/users/update/:id` | Actualizar usuario |
| **Usuarios** | DELETE | `/api/users/delete/:id` | Eliminar usuario |
| **Hash** | POST | `/api/hash/sha256` | Generar hash SHA-256 |
| **Hash** | POST | `/api/hash/argon2` | Hash de contraseña Argon2 |
| **Simétrico** | POST | `/api/encrypt/aes_cbc` | Cifrar con AES-256-CBC |
| **Simétrico** | POST | `/api/decrypt/aes_cbc` | Descifrar AES-256-CBC |
| **Simétrico** | POST | `/api/encrypt/chacha20` | Cifrar con ChaCha20 |
| **Simétrico** | POST | `/api/decrypt/chacha20` | Descifrar ChaCha20 |
| **Asimétrico** | POST | `/api/generate/rsa` | Generar llaves RSA |
| **Asimétrico** | POST | `/api/generate/dsa` | Generar llaves DSA |
| **Asimétrico** | POST | `/api/generate/ecdsa` | Generar llaves ECDSA |
| **Asimétrico** | POST | `/api/encrypt/rsa` | Cifrar con RSA-OAEP |
| **Asimétrico** | POST | `/api/decrypt/rsa` | Descifrar RSA-OAEP |
| **Asimétrico** | POST | `/api/sign/dsa` | Firmar con DSA/ECDSA |
| **Asimétrico** | POST | `/api/verify/dsa` | Verificar firma |

---

## 🧪 Ejemplos de Peticiones y Respuestas (12 Endpoints Implementados)

### Configuración en Postman/Insomnia

Para todas las peticiones POST:
1. Configurar **Content-Type** como `application/json` en los headers
2. Seleccionar el método HTTP correcto (GET/POST/PUT/DELETE)
3. Usar la URL base: `http://localhost:3000`

---

### 1️⃣ Hash SHA-256

**Endpoint:** `POST http://localhost:3000/api/hash/sha256`

**Entrada (Body JSON):**
```json
{
  "text": "Hola, este es un mensaje secreto"
}
```

**Salida Esperada:**
```json
{
  "hash": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
}
```

**Descripción:** Genera un hash SHA-256 del texto proporcionado. Este hash es determinístico (siempre produce el mismo resultado para el mismo input) y es de un solo sentido (no se puede revertir).

---

### 2️⃣ Argon2 - Generar Hash

**Endpoint:** `POST http://localhost:3000/api/hash/argon2`

**Entrada (Body JSON):**
```json
{
  "password": "MiPasswordSuperSeguro123!"
}
```

**Salida Esperada:**
```json
{
  "hash": "$argon2id$v=19$m=65536,t=3,p=2$someRandomSalt$hashedPasswordDataHere"
}
```

**Descripción:** Genera un hash seguro de la contraseña usando Argon2id, el algoritmo ganador del Password Hashing Competition. Incluye un salt aleatorio y es resistente a ataques de fuerza bruta.

---

### 3️⃣ Argon2 - Verificar Hash

**Endpoint:** `POST http://localhost:3000/api/hash/verify`

**Entrada (Body JSON):**
```json
{
  "password": "MiPasswordSuperSeguro123!",
  "hash": "$argon2id$v=19$m=65536,t=3,p=2$someRandomSalt$hashedPasswordDataHere"
}
```

**Salida Esperada:**
```json
{
  "valid": true
}
```

**Descripción:** Verifica si una contraseña coincide con un hash Argon2 previamente generado. Retorna `true` si coincide, `false` si no.

---

### 4️⃣ AES-256-CBC - Cifrar

**Endpoint:** `POST http://localhost:3000/api/encrypt/aes_cbc`

**Entrada (Body JSON):**
```json
{
  "text": "Este es un mensaje confidencial"
}
```

**Salida Esperada:**
```json
{
  "ciphertext": "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y=",
  "key": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=",
  "iv": "YWJjZGVmZ2hpamtsbW5vcA==",
  "algorithm": "aes-256-cbc"
}
```

**Descripción:** Cifra el texto usando AES-256 en modo CBC (Cipher Block Chaining). Genera una llave de 32 bytes y un IV (vector de inicialización) de 16 bytes aleatorios. **IMPORTANTE:** Guarda el `ciphertext`, `key` e `iv` para poder descifrar después.

---

### 5️⃣ AES-256-CBC - Descifrar

**Endpoint:** `POST http://localhost:3000/api/decrypt/aes_cbc`

**Entrada (Body JSON):**
```json
{
  "ciphertext": "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y=",
  "key": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=",
  "iv": "YWJjZGVmZ2hpamtsbW5vcA=="
}
```

**Salida Esperada:**
```json
{
  "plainText": "Este es un mensaje confidencial"
}
```

**Descripción:** Descifra el texto previamente cifrado con AES-256-CBC. Debes usar exactamente la misma `key` e `iv` que se usaron para cifrar.

---

### 6️⃣ ChaCha20-Poly1305 - Cifrar

**Endpoint:** `POST http://localhost:3000/api/encrypt/chacha20`

**Entrada (Body JSON):**
```json
{
  "text": "Mensaje ultra secreto con ChaCha20"
}
```

**Salida Esperada:**
```json
{
  "ciphertext": "dGVzdGNpcGhlcnRleHRoZXJl",
  "key": "Y2hhY2hhMjBrZXkzMmJ5dGVzaGVyZQ==",
  "nonce": "bm9uY2UxMmJ5dGVz",
  "authTag": "YXV0aHRhZzE2Ynl0ZXM=",
  "algorithm": "chacha20-poly1305"
}
```

**Descripción:** Cifra usando ChaCha20-Poly1305, un cifrado de flujo moderno con autenticación integrada. Genera una llave de 32 bytes, un nonce de 12 bytes y un tag de autenticación de 16 bytes. **IMPORTANTE:** Guarda todos los campos para descifrar.

---

### 7️⃣ ChaCha20-Poly1305 - Descifrar

**Endpoint:** `POST http://localhost:3000/api/decrypt/chacha20`

**Entrada (Body JSON):**
```json
{
  "ciphertext": "dGVzdGNpcGhlcnRleHRoZXJl",
  "key": "Y2hhY2hhMjBrZXkzMmJ5dGVzaGVyZQ==",
  "nonce": "bm9uY2UxMmJ5dGVz",
  "authTag": "YXV0aHRhZzE2Ynl0ZXM="
}
```

**Salida Esperada:**
```json
{
  "plainText": "Mensaje ultra secreto con ChaCha20"
}
```

**Descripción:** Descifra y verifica la autenticidad del mensaje cifrado con ChaCha20-Poly1305. Si el `authTag` no coincide, el descifrado fallará, indicando que los datos fueron modificados.

---

### 8️⃣ RSA - Generar Par de Llaves

**Endpoint:** `POST http://localhost:3000/api/generate/rsa`

**Entrada (Body JSON):**
```json
{
  "keySize": 2048
}
```

**Salida Esperada:**
```json
{
  "success": true,
  "message": "Par de llaves RSA generado correctamente",
  "data": {
    "publicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF...",
    "privateKey": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2d...",
    "algorithm": "RSA",
    "keySize": 2048
  }
}
```

**Descripción:** Genera un par de llaves RSA (pública y privada) del tamaño especificado. La llave pública se usa para cifrar y verificar firmas, mientras que la llave privada se usa para descifrar y firmar. **IMPORTANTE:** Guarda ambas llaves para los siguientes pasos.

---

### 9️⃣ RSA - Cifrar

**Endpoint:** `POST http://localhost:3000/api/encrypt/rsa`

**Entrada (Body JSON):**
```json
{
  "text": "Documento confidencial",
  "publicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF..."
}
```

**Salida Esperada:**
```json
{
  "success": true,
  "message": "Texto cifrado correctamente con RSA-OAEP",
  "data": {
    "encryptedData": "ZW5jcnlwdGVkZGF0YWluYmFzZTY0Zm9ybWF0aGVyZQ==",
    "algorithm": "RSA-OAEP",
    "hashAlgorithm": "SHA-256"
  }
}
```

**Descripción:** Cifra el texto usando RSA-OAEP (Optimal Asymmetric Encryption Padding) con SHA-256. Solo el poseedor de la llave privada correspondiente podrá descifrar este mensaje. **LIMITACIÓN:** RSA-2048 solo puede cifrar ~190 bytes de texto plano.

---

### 🔟 RSA - Descifrar

**Endpoint:** `POST http://localhost:3000/api/decrypt/rsa`

**Entrada (Body JSON):**
```json
{
  "encryptedData": "ZW5jcnlwdGVkZGF0YWluYmFzZTY0Zm9ybWF0aGVyZQ==",
  "privateKey": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2d..."
}
```

**Salida Esperada:**
```json
{
  "success": true,
  "message": "Texto descifrado correctamente con RSA-OAEP",
  "data": {
    "decryptedData": "Documento confidencial",
    "algorithm": "RSA-OAEP"
  }
}
```

**Descripción:** Descifra el texto cifrado con RSA-OAEP usando la llave privada correspondiente. Solo la llave privada que coincide con la llave pública usada para cifrar puede descifrar el mensaje exitosamente.

---

### 1️⃣1️⃣ DSA/ECDSA - Firmar Mensaje

**Endpoint:** `POST http://localhost:3000/api/sign/dsa`

**Entrada (Body JSON):**
```json
{
  "message": "Contrato legal importante que debe ser autenticado",
  "privateKey": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUJWQUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQVQ0d2dn...",
  "algorithm": "DSA"
}
```

**Salida Esperada:**
```json
{
  "success": true,
  "message": "Mensaje firmado correctamente con DSA",
  "data": {
    "signature": "c2lnbmF0dXJlZGF0YWluYmFzZTY0Zm9ybWF0aGVyZQ==",
    "message": "Contrato legal importante que debe ser autenticado",
    "algorithm": "DSA",
    "hashAlgorithm": "SHA-256"
  }
}
```

**Descripción:** Firma digitalmente un mensaje usando la llave privada DSA o ECDSA. La firma garantiza la autenticidad (quien firmó) e integridad (que no fue modificado) del mensaje. Puedes usar `"algorithm": "DSA"` o `"algorithm": "ECDSA"` según el tipo de llaves generadas.

**Nota:** Primero debes generar llaves DSA con `POST /api/generate/dsa` o llaves ECDSA con `POST /api/generate/ecdsa`.

---

### 1️⃣2️⃣ DSA/ECDSA - Verificar Firma

**Endpoint:** `POST http://localhost:3000/api/verify/dsa`

**Entrada (Body JSON):**
```json
{
  "message": "Contrato legal importante que debe ser autenticado",
  "signature": "c2lnbmF0dXJlZGF0YWluYmFzZTY0Zm9ybWF0aGVyZQ==",
  "publicKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dL..."
}
```

**Salida Esperada:**
```json
{
  "success": true,
  "message": "Verificación de firma completada",
  "data": {
    "isValid": true,
    "message": "Contrato legal importante que debe ser autenticado",
    "verified": "Firma válida"
  }
}
```

**Descripción:** Verifica la firma digital de un mensaje usando la llave pública DSA/ECDSA correspondiente. Retorna `isValid: true` si la firma es válida (el mensaje no fue modificado y fue firmado por el poseedor de la llave privada correspondiente), o `isValid: false` si la firma es inválida.

---

## 📝 Notas Importantes para Pruebas

### 1. Orden de Ejecución

Para obtener resultados correctos, sigue este orden:

- **Cifrado simétrico (AES/ChaCha20):**
  1. Primero ejecuta **cifrar** → obtendrás `ciphertext`, `key`, `iv`/`nonce`, etc.
  2. Luego usa esos valores exactos para **descifrar**

- **Hash Argon2:**
  1. Primero ejecuta **generar hash** → obtendrás el hash
  2. Luego usa ese hash para **verificar**

- **Cifrado asimétrico (RSA):**
  1. Primero ejecuta **generar llaves** → obtendrás `publicKey` y `privateKey`
  2. Usa la `publicKey` para **cifrar**
  3. Usa la `privateKey` correspondiente para **descifrar**

### 2. Valores en Base64

- Todos los campos `key`, `iv`, `nonce`, `authTag`, `publicKey`, `privateKey` están en formato **Base64**
- **NO modifiques** estos valores manualmente
- Copia y pega los valores exactos entre peticiones

### 3. Límites de RSA

- RSA-2048 solo puede cifrar aproximadamente **190 bytes** de texto plano
- Para textos más largos, considera usar cifrado híbrido (próximamente implementado)
- Ejemplo de mensaje demasiado largo: un párrafo de más de 190 caracteres

### 4. Seguridad de Llaves

⚠️ **IMPORTANTE PARA PRODUCCIÓN:**
- **NUNCA** almacenes llaves privadas sin cifrar en bases de datos
- Usa servicios de gestión de llaves como:
  - AWS KMS (Key Management Service)
  - Azure Key Vault
  - Google Cloud KMS
  - HashiCorp Vault

### 5. Errores Comunes y Soluciones

| Error | Causa Probable | Solución |
|-------|----------------|----------|
| `Error al descifrar` | Key/IV incorrectos | Verifica que uses exactamente la misma `key` e `iv` del cifrado original |
| `Firma inválida` | Llaves no coinciden | La llave pública debe corresponder a la llave privada usada para firmar |
| `Text too long for RSA` | Mensaje > 190 bytes | Reduce el tamaño del mensaje o implementa cifrado híbrido |
| `Invalid Base64` | Formato incorrecto | Asegúrate de copiar los valores completos sin modificarlos |
| `Authentication failed` (ChaCha20) | authTag incorrecto | Los datos fueron modificados o el authTag no coincide |

### 6. Validación de Inputs

El API realiza las siguientes validaciones:
- **Campos requeridos:** Todos los endpoints validan que se proporcionen todos los campos necesarios
- **Tipos de datos:** Verifica que los tipos sean correctos (string, number, etc.)
- **Formato Base64:** Valida que las llaves y datos cifrados estén en formato Base64 válido

### 7. Ejemplos de Flujos Completos

#### Flujo AES-256-CBC:
```
1. POST /api/encrypt/aes_cbc
   Input: {"text": "Mensaje secreto"}
   Output: {ciphertext, key, iv}

2. POST /api/decrypt/aes_cbc
   Input: {ciphertext, key, iv} ← usar los valores del paso 1
   Output: {plainText: "Mensaje secreto"}
```

#### Flujo RSA:
```
1. POST /api/generate/rsa
   Input: {"keySize": 2048}
   Output: {publicKey, privateKey}

2. POST /api/encrypt/rsa
   Input: {"text": "Confidencial", "publicKey": <del paso 1>}
   Output: {encryptedData}

3. POST /api/decrypt/rsa
   Input: {encryptedData, privateKey: <del paso 1>}
   Output: {decryptedData: "Confidencial"}
```

## 🔧 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/crypto-backend

# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/crypto-backend?retryWrites=true&w=majority
```

## 📊 Modelo de Datos

### Usuario (MongoDB Schema)

```javascript
{
  name: String,      // Requerido
  lastName: String,  // Requerido  
  nickName: String,  // Requerido
  email: String,     // Opcional
  password: String,  // Opcional (hasheada con Argon2)
  status: String     // Requerido
}
```

## ⚠️ Seguridad

### Mejores Prácticas Implementadas

1. **Llaves y Secretos**:
   - Nunca hardcodear llaves en el código
   - Usar variables de entorno
   - Llaves privadas nunca se almacenan sin cifrar

2. **Cifrado**:
   - IVs/Nonces únicos para cada operación
   - Tamaños de llave seguros (256 bits mínimo)
   - Algoritmos modernos (AES-256, ChaCha20, RSA-2048+)

3. **Base de Datos**:
   - Contraseñas hasheadas con Argon2
   - Conexiones seguras con MongoDB Atlas
   - Validación de entrada en todos los endpoints

### ⚡ Recomendaciones para Producción

```javascript
// 1. Habilitar HTTPS
app.use(helmet());
app.use(compression());

// 2. Rate limiting
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de requests
});
app.use('/api/', limiter);

// 3. Validación de entrada
const { body, validationResult } = require('express-validator');

// 4. Logging
const winston = require('winston');

// 5. CORS configurado
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};
```

## 🤝 Equipo de Desarrollo

- **Emanuel** - Funciones Hash (SHA-256, Argon2)
- **Stock** - Cifrado Simétrico (AES, ChaCha20) 
- **David** - Cifrado Asimétrico (RSA, DSA, ECDSA) 

## 📝 Licencia

MIT License - Ver archivo `LICENSE`

## 🐛 Solución de Problemas

### Error: MongoDB connection failed

```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod

# O en Windows
net start MongoDB
```

### Error: Cannot find module

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use

```bash
# Cambiar puerto en .env
PORT=3001

# O matar el proceso usando el puerto
lsof -i :3000
kill -9 [PID]
```

## 📚 Recursos Adicionales

- [Documentación Node.js Crypto](https://nodejs.org/api/crypto.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

---