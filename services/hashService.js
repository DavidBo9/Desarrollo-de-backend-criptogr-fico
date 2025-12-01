// services/cryptoService.js

const crypto = require("crypto");
const argon2 = require("argon2");

class CryptoService {

    static generarSHA256(texto) {
        return crypto.createHash("sha256")
            .update(texto)
            .digest("hex");
    }

    static async generarArgon2(password) {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            timeCost: 3,
            memoryCost: 64 * 1024,
            parallelism: 2
        });
    }

    static async verificarArgon2(password, hash) {
        return await argon2.verify(hash, password);
    }
}

module.exports = CryptoService;