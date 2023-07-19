import { handleLogin } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/auth/signup:
 *   get:
 *     summary: Redirects users to your identity provider for them to sign up.
 *     tags:
 *       - auth
 *     responses:
 *       302:
 *         description: Redirects to Location.
 */

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  handleLogin(req, res, {
    authorizationParams: {
      screen_hint: 'signup'
    }
  });

export default handler;
