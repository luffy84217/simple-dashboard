import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{
  spec: any;
}>(import('swagger-ui-react') as any, { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Swagger API Docs',
        version: '0.1.0'
      },
      servers: [{ url: process.env.AUTH0_BASE_URL }]
    },
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
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'appSession'
        }
      }
    }
  });

  return {
    props: {
      spec
    }
  };
};

export default ApiDoc;
