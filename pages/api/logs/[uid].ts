import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import qs from 'qs';

/**
 * @swagger
 * /api/logs/{user_id}:
 *   get:
 *     summary: Retrieve log entries that match the specified user.
 *     tags:
 *       - logs
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
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user involved in the event.
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *         description: Number of results per page. Paging is disabled if parameter not sent.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to use for sorting appended with :1 for ascending and :-1 for descending. e.g. date:-1
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logs successfully retrieved.
 *
 */

export default withApiAuthRequired(async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        const { uid, ...query } = req.query;
        const response = await fetch(
          `${process.env.AUTH0_AUDIENCE}users/${uid}/logs${qs.stringify(query, { addQueryPrefix: true })}`,
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
