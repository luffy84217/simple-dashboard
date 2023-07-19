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
    openapi: '3.0.3',
    info: {
      title: 'NextJS Swagger',
      version: '0.1.0'
    },
    servers: [{ url: process.env.AUTH0_BASE_URL }],
    components: {
      securitySchemes: {
        oAuth2ClientCredentials: {
          type: 'oauth2',
          flows: {
            clientCredentials: {
              tokenUrl: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
              scopes: {}
            }
          }
        },
        oAuth2Password: {
          type: 'oauth2',
          flows: {
            password: {
              tokenUrl: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
              scopes: {
                openid: 'Grant read-only access to the user open id',
                profile: 'Grant read-only access to the account and user info only',
                email: 'Grant read-only access to the user email'
              }
            }
          }
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'appSession'
        }
      }
    }
  },
  apiFolder: 'pages/api'
});

export default swaggerHandler();
