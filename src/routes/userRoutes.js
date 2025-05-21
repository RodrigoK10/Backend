const express = require('express');
const router = express.Router();
const { sql, config } = require('../config/db');

// GET - Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Rodrigo');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            error: 'Error al obtener usuarios',
            details: error.message
        });
    }
});

// GET - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Rodrigo WHERE id_usuario = @id');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// POST - Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { usuario, contrasena, correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('usuario', sql.NVarChar, usuario)
            .input('contrasena', sql.NVarChar, contrasena)
            .input('correo', sql.NVarChar, correo_electronico)
            .query(`
                INSERT INTO Rodrigo (usuario, contrasena, correo_electronico)
                VALUES (@usuario, @contrasena, @correo);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            id: result.recordset[0].id
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            error: 'Error al crear usuario',
            details: error.message 
        });
    }
});

// PUT - Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { usuario, contrasena, correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('usuario', sql.NVarChar, usuario)
            .input('contrasena', sql.NVarChar, contrasena)
            .input('correo', sql.NVarChar, correo_electronico)
            .query(`
                UPDATE Rodrigo 
                SET usuario = @usuario,
                    contrasena = @contrasena,
                    correo_electronico = @correo
                WHERE id_usuario = @id
            `);
        
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// DELETE - Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Rodrigo WHERE id_usuario = @id');
        
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
