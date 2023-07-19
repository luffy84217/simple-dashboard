import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Request an access token.
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: OK.
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: 'client_credentials'
          },
          null,
          2
        )
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
