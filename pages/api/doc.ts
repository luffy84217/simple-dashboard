import { withSwagger } from 'next-swagger-doc';
/**
 * @swagger
 * /api/doc:
 *   get:
 *     summary: Fetch swagger definition in JSON format.
 *     responses:
 *       200:
 *         description: OK
 */
const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NextJS Swagger',
      version: '0.1.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        CookieAuth: {
          type: 'sessionCookie',
          in: 'cookie',
          name: 'appSession'
        }
      }
    }
  },
  apiFolder: 'pages/api'
});

export default swaggerHandler();
