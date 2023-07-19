import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/jobs/verification-email:
 *   post:
 *     summary: Send an email to the specified user that asks them to click a link to verify their email address.
 *     tags:
 *       - job
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: use access token to access Auth0 Management API.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 default: auth0|64b51061e6fd28952ae1cdf0
 *                 description: user_id of the user to send the verification email to.
 *     responses:
 *       201:
 *         description: Job successfully created.
 *
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'POST':
        const { user_id } = req.body;

        if (!user_id) {
          return res.status(400).send('Invalid request parameters.');
        }

        const response = await fetch(`${process.env.AUTH0_AUDIENCE}jobs/verification-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: req.headers.authorization
          },
          body: JSON.stringify({ user_id }, null, 2)
        });
        const data = await response.json();

        res.status(response.status).json(data);
        break;
      default:
        res.setHeader('Allow', 'POST');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(error.response.status || 500).json(error.response.data);
  }
};

export default handler;
