const express = require('express');
const cors = require('cors');
const { sql, config } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { verifyToken } = require('./middleware/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

// Iniciar conexión a la base de datos
connectDB();

// Rutas públicas de autenticación
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren token)
app.use('/api/usuarios', verifyToken, userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
