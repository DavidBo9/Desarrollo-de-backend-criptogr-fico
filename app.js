const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumentar límite para llaves grandes
app.use(express.urlencoded({ extended: true }));

// Middleware para logging (opcional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta de prueba con documentación completa
app.get('/', (req, res) => {
    res.json({
        message: '🔐 Backend Criptográfico - API REST',
        version: '1.0.0',
        endpoints: {
            usuarios: {
                base: '/api/users',
                operations: {
                    getAll: 'GET /api/users/all',
                    create: 'POST /api/users/add',
                    update: 'PUT /api/users/update/:id',
                    delete: 'DELETE /api/users/delete/:id'
                }
            },
            funciones_hash: {
                sha256: 'POST /api/hash/sha256',
                argon2: 'POST /api/hash/argon2',
                verify_argon2: 'POST /api/hash/verify'
            },
            cifrado_simetrico: {
                aes: {
                    encrypt: 'POST /api/encrypt/aes_cbc',
                    decrypt: 'POST /api/decrypt/aes_cbc'
                },
                chacha20: {
                    encrypt: 'POST /api/encrypt/chacha20',
                    decrypt: 'POST /api/decrypt/chacha20'
                },
                utils: {
                    generateKey: 'GET /api/encrypt/generate-key',
                    diffieHellman: {
                        init: 'POST /api/encrypt/diffie-hellman/init',
                        complete: 'POST /api/encrypt/diffie-hellman/complete'
                    }
                }
            },
            cifrado_asimetrico: {
                generate_keys: {
                    rsa: 'POST /api/generate/rsa',
                    dsa: 'POST /api/generate/dsa',
                    ecdsa: 'POST /api/generate/ecdsa'
                },
                rsa: {
                    encrypt: 'POST /api/encrypt/rsa',
                    decrypt: 'POST /api/decrypt/rsa'
                },
                dsa_ecdsa: {
                    sign: 'POST /api/sign/dsa',
                    verify: 'POST /api/verify/dsa'
                },
                hybrid: {
                    encrypt_and_sign: 'POST /api/hybrid/encrypt-sign',
                    verify_and_decrypt: 'POST /api/hybrid/verify-decrypt'
                }
            }
        },
        documentation: '/api-docs (Coming soon)',
        status: 'Active'
    });
});

// Importar rutas
const userRoute = require('./routes/user.route');
const symmetricRoute = require('./routes/symmetric.route');
const asymmetricRoute = require('./routes/asymmetric.route');
const hashRoute = require('./routes/hash.route');

// ===========================================
// SECCIÓN DE RUTAS CORREGIDA (MONTAJE ÚNICO)
// ===========================================

// Ruta de usuarios (mantener separada ya que tiene un prefijo único: /api/users)
app.use('/api/users', userRoute);

// Rutas de cifrado simétrico y asimétrico:
// El router simétrico y asimétrico ya deben contener los prefijos /encrypt, /decrypt, /sign, etc.,
// por lo que se montan solo una vez bajo el prefijo base /api.

app.use('/api', symmetricRoute); 
app.use('/api', asymmetricRoute);
app.use('/api/hash', hashRoute);

// ===========================================
// FIN DE LA SECCIÓN DE RUTAS CORREGIDA
// ===========================================

// Ruta para health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Configuración de MongoDB y arranque del servidor
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-backend';

// Configuración de Mongoose
mongoose.set('strictQuery', false);

// Conectar a MongoDB
mongoose.connect(MONGODB_URI) // <-- Opciones obsoletas eliminadas
.then(() => {
    console.log('✅ Conexión a MongoDB exitosa');
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
    
    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
        console.log(`📡 API disponible en http://localhost:${PORT}`);
        console.log(`📊 Health check en http://localhost:${PORT}/health`);
        console.log('\n🔐 Módulos de cifrado cargados:');
        console.log('   ✓ Cifrado Simétrico (AES-256, ChaCha20)');
        console.log('   ✓ Cifrado Asimétrico (RSA, DSA, ECDSA)');
        console.log('   ✓ Funciones Hash (SHA-256, Argon2)');
    });
})
.catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    console.log('💡 Asegúrate de que MongoDB esté ejecutándose');
    console.log('💡 Puedes cambiar la URI en el archivo .env');
    
    // Iniciar servidor sin base de datos (modo desarrollo)
    app.listen(PORT, () => {
        console.log(`⚠️  Servidor iniciado SIN conexión a base de datos`);
        console.log(`📡 API disponible en http://localhost:${PORT}`);
        console.log(`   (Funcionalidad limitada sin MongoDB)`);
    });
});

// Manejo de señales de terminación
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    mongoose.connection.close(() => {
        console.log('📦 Conexión a MongoDB cerrada');
        process.exit(0);
    });
});

module.exports = app;