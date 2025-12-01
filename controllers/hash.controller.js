// controllers/hash.controller.js

const CryptoService = require("../services/cryptoService");

class HashController {

    static generarSHA256(req, res) {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Falta el campo 'text'." });
        }

        const hash = CryptoService.generarSHA256(text);
        return res.json({ hash });
    }

    static async generarArgon2(req, res) {
        try {
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ message: "Falta el campo 'password'." });
            }

            const hash = await CryptoService.generarArgon2(password);
            return res.json({ hash });

        } catch (error) {
            return res.status(500).json({ message: "Error generando hash Argon2." });
        }
    }

    static async verificarArgon2(req, res) {
        try {
            const { password, hash } = req.body;

            if (!password || !hash) {
                return res.status(400).json({ message: "Faltan 'password' y/o 'hash'." });
            }

            const valido = await CryptoService.verificarArgon2(password, hash);
            return res.json({ valid: valido });

        } catch (error) {
            return res.status(500).json({
                message: "Error verificando hash Argon2."
            });
        }
    }
}

module.exports = HashController;
