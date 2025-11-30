// Importaciones de módulos
const express = require('express');
const app = express();
const symmetricRoutes = require('./routes/symmetric.route')

app.use(express.json());
app.use('/', symmetricRoutes);

// Conexión a la base de datos y arranque del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor escuchando en http://localhost:3000');
    console.log('Listo para probar endpoins en Postman')
});