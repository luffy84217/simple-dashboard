import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/auth/validate:
 *   post:
 *     summary: Validate the password.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 default: example
 *                 description: current password of the user.
 *     responses:
 *       200:
 *         description: OK.
 */

// IMPORTANT: Since there's no endpoint to validate current old password, authentication instead.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      const session = await getSession(req, res);
      const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          scope: 'openid profile email',
          grant_type: 'password',
          username: session.user.email,
          password: JSON.parse(req.body).password
        })
      });
      const data = await response.json();

      if (data.error) {
        return res.status(response.status).json(data);
      }
      res.status(200).json(data);
      break;
    default:
      res.setHeader('Allow', 'POST');
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
