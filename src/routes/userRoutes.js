const express = require('express');
const router = express.Router();
const { sql, config } = require('../config/db');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                   usuario:
 *                     type: string
 *                   correo_electronico:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
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

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 usuario:
 *                   type: string
 *                 correo_electronico:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
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

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               correo_electronico:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
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

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
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
