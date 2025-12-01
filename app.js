/// Esto es una prueba

console.log("Hola, mundo!");

const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Rutas del proyecto
app.use("/api/users", require("./routes/user.route"));
app.use("/api/hash", require("./routes/hash.route")); // ← ESTA ES LA IMPORTANTE

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;

