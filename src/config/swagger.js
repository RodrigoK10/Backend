import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gestión de Usuarios',
            version: '1.0.0',
            description: 'API para gestionar usuarios con autenticación JWT',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Rutas donde están los comentarios de Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 