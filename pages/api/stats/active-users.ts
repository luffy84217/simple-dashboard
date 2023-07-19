import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import qs from 'qs';

/**
 * @swagger
 * /api/stats/active-users:
 *   get:
 *     summary: Retrieve the number of active users that logged in.
 *     tags:
 *       - stats
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: use access token to access Auth0 Management API.
 *       - in: cookie
 *         name: appSession
 *         schema:
 *           type: string
 *         required: true
 *         description: use session cookie to access API with auth required.
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: first day of the date range (inclusive) in YYYYMMDD format.
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: last day of the date range (inclusive) in YYYYMMDD format.
 *       - in: query
 *         name: aggregation
 *         schema:
 *           type: string
 *         description:
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description:
 *     responses:
 *       200:
 *         description: Number of active users successfully retrieved.
 *
 */

export default withApiAuthRequired(async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        const response = await fetch(
          `${process.env.AUTH0_AUDIENCE}stats/active-users${qs.stringify(req.query, { addQueryPrefix: true })}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: req.headers.authorization
            }
          }
        );
        const data = await response.json();

        if (response.ok) {
          return res.status(200).json(data);
        }

        res.status(response.status).json(data);
        break;
      default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(error.response.status || 500).json(error.response.data);
  }
});
