import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasena
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     usuario:
 *                       type: string
 *                     correo_electronico:
 *                       type: string
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       500:
 *         description: Error del servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasena
 *               - correo_electronico
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *               correo_electronico:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     usuario:
 *                       type: string
 *                     correo_electronico:
 *                       type: string
 *       400:
 *         description: El usuario ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/register', register);

export default router; 