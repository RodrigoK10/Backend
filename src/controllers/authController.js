const bcrypt = require('bcryptjs');
const { sql, config } = require('../config/db');
const { generateToken } = require('../middleware/auth');

const login = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('usuario', sql.NVarChar, usuario)
            .query('SELECT * FROM Rodrigo WHERE usuario = @usuario');

        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        console.log('Usuario encontrado:', {
            usuario: user.usuario,
            contrasenaAlmacenada: user.contrasena,
            contrasenaRecibida: contrasena
        });

        // Primero intentar verificar si la contraseña está hasheada
        let validPassword = false;
        try {
            validPassword = await bcrypt.compare(contrasena, user.contrasena);
            console.log('Resultado de comparación bcrypt:', validPassword);
        } catch (error) {
            console.log('Error en bcrypt compare:', error.message);
            // Si la contraseña no está hasheada, verificar si coincide exactamente
            if (contrasena === user.contrasena) {
                // Si coincide, actualizar a versión hasheada
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(contrasena, salt);
                
                await pool.request()
                    .input('id', sql.Int, user.id_usuario)
                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                    .query('UPDATE Rodrigo SET contrasena = @hashedPassword WHERE id_usuario = @id');
                
                validPassword = true;
                console.log('Contraseña actualizada con hash');
            }
        }

        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token
        const token = generateToken(user.id_usuario);

        res.json({
            token,
            user: {
                id: user.id_usuario,
                usuario: user.usuario,
                correo_electronico: user.correo_electronico
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const register = async (req, res) => {
    const { usuario, contrasena, correo_electronico } = req.body;

    try {
        // Verificar si el usuario ya existe
        const pool = await sql.connect(config);
        const userExists = await pool.request()
            .input('usuario', sql.NVarChar, usuario)
            .query('SELECT * FROM Rodrigo WHERE usuario = @usuario');

        if (userExists.recordset.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Insertar nuevo usuario
        const result = await pool.request()
            .input('usuario', sql.NVarChar, usuario)
            .input('contrasena', sql.NVarChar, hashedPassword)
            .input('correo', sql.NVarChar, correo_electronico)
            .query(`
                INSERT INTO Rodrigo (usuario, contrasena, correo_electronico)
                VALUES (@usuario, @contrasena, @correo);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        const userId = result.recordset[0].id;
        const token = generateToken(userId);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: userId,
                usuario,
                correo_electronico
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    login,
    register
}; 