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
| **SHA-256** | `POST` | `/hash/sha256` | `{"data": "El mensaje secreto"}` |
| **Argon2 (Hash)** | `POST` | `/hash/argon2` | `{"password": "passwordSeguro123"}` |
| **Argon2 (Verify)** | `POST` | `/hash/verify/argon2` | `{"password": "passwordSeguro123", "hash": "<HASH_RECIBIDO_DE_LA_PETICIÓN_ANTERIOR>"}` |

---

### 3. 🔑 Cifrado Simétrico (Symmetric Crypto)

* **NOTA:** Los campos `text`, `encryptedData`, `key`, `iv`, `nonce` y `authTag` deben ser enviados en formato **Base64**.

#### AES-256-CBC

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Generar Llave** | `GET` | `/generate-key` | **(No Body requerido)** |
| **Cifrar** | `POST` | `/encrypt/aes_cbc` | `{"text": "Mensaje Secreto", "key": "<LLAVE_BASE64>", "iv": "<IV_BASE64>"}` |
| **Descifrar** | `POST` | `/decrypt/aes_cbc` | `{"encryptedData": "<DATA_BASE64>", "key": "<LLAVE_BASE64>", "iv": "<IV_BASE64>"}` |

#### ChaCha20-Poly1305

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Cifrar** | `POST` | `/encrypt/chacha20` | `{"text": "Mensaje Secreto", "key": "<LLAVE_BASE64>"}` |
| **Descifrar** | `POST` | `/decrypt/chacha20` | `{"encryptedData": "<DATA_BASE64>", "key": "<LLAVE_BASE64>", "nonce": "<NONCE_BASE64>", "authTag": "<TAG_BASE64>"}` |

#### Diffie-Hellman (Intercambio de Llaves)

| Endpoints | Método | URL (Sufijo) | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **Iniciar** | `POST` | `/encrypt/diffie-hellman/init` | `{"sessionId": "session-123-A"}` |
| **Completar** | `POST` | `/encrypt/diffie-hellman/complete` | `{"sessionId": "session-123-A", "otherPublicKey": "<LLAVE_PÚBLICA_DE_B>"}` |

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
| **Verificar DSA/ECDSA** | `POST` | `/sign/dsa` | `{"message": "Documento importante", "signature": "<FIRMA_BASE64>", "publicKey": "<DSA_PUBLIC_KEY>"}` |
| **Híbrido (Encrypt/Sign)** | `POST` | `/hybrid/encrypt-sign` | **(Body complejo)** |

## 📁 Estructura del Proyecto

```
desarrollo-de-backend-criptografico/
│
├── 📁 controllers/
│   ├── user.controller.js          # CRUD de usuarios
│   ├── symmetric.controller.js     # Controlador cifrado simétrico
│   └── asymmetric.controller.js    # Controlador cifrado asimétrico
│   
├── 📁 models/
│   └── user.model.js               # Modelo de usuario MongoDB
│
├── 📁 routes/
│   ├── user.route.js               # Rutas de usuarios
│   ├── symmetric.route.js          # Rutas cifrado simétrico
│   └── asymmetric.route.js         # Rutas cifrado asimétrico
│
├── 📁 services/
│   ├── cryptoService.js            # Lógica AES, ChaCha20, Diffie-Hellman
│   └── asymmetricService.js        # Lógica RSA, DSA, ECDSA
│
├── 📁 test/
│   ├── symmetric.examples.js       # Ejemplos cifrado simétrico
│   └── asymmetric.examples.js      # Ejemplos cifrado asimétrico
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

## 🧪 Pruebas

### Ejecutar ejemplos
```bash
# Probar cifrado simétrico
node test/symmetric.examples.js

# Probar cifrado asimétrico  
node test/asymmetric.examples.js
```

### Usando Postman o Thunder Client

1. Importar la colección desde `postman_collection.json` (si existe)
2. O crear requests manualmente con los ejemplos en `/test`

### Ejemplo con cURL

```bash
# Generar llave simétrica
curl http://localhost:3000/api/encrypt/generate-key

# Generar llaves RSA
curl -X POST http://localhost:3000/api/generate/rsa \
  -H "Content-Type: application/json" \
  -d '{"keySize": 2048}'

# Cifrar con AES
curl -X POST http://localhost:3000/api/encrypt/aes_cbc \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mensaje secreto",
    "key": "base64KeyHere..."
  }'
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
