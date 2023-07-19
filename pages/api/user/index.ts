import { getSession, updateSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import qs from 'qs';

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve current log in user details.
 *     tags:
 *       - user
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
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include or exclude (based on value provided for include_fields) in the result. Leave empty to retrieve all fields.
 *       - in: query
 *         name: include_fields
 *         schema:
 *           type: string
 *         description: Whether specified fields are to be included (true) or excluded (false).
 *     responses:
 *       200:
 *         description: User successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickname:
 *                   type: string
 *                   default: example
 *                   description: Preferred nickname or alias of this user.
 *                 name:
 *                   type: string
 *                   default: example
 *                   description: Name of this user.
 *                 picture:
 *                   type: string
 *                   default: https://s.gravatar.com/avatar/378f32e9798b7e52bbe615fc80e3806c?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Flu.png
 *                   description: URL to picture, photo, or avatar of this user.
 *                 updated_at:
 *                   type: string
 *                   default: 2023-07-17T11:52:09.020Z
 *                   description: Date and time when this user was last updated/modified (ISO_8601 format).
 *                 email:
 *                   type: string
 *                   default: examples@gmail.com
 *                   description: Email address of this user.
 *                 email_verified:
 *                   type: boolean
 *                   default: true
 *                   description: Whether this email address is verified (true) or unverified (false).
 *   patch:
 *     summary: Update current log in user.
 *     tags:
 *       - user
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
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: example
 *                 description: New name of this user.
 *               password:
 *                 type: string
 *                 default: example
 *                 description: new password of the user.
 *               connection:
 *                 type: string
 *                 default: Username-Password-Authentication
 *                 description:
 *     responses:
 *       200:
 *         description: User successfully updated.
 *
 */

export default withApiAuthRequired(async (req, res) => {
  try {
    switch (req.method) {
      case 'GET': {
        const session = await getSession(req, res);
        const response = await fetch(
          `${process.env.AUTH0_AUDIENCE}users/${session.user.sub}${qs.stringify(req.query, { addQueryPrefix: true })}`,
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
      }
      case 'PATCH': {
        const session = await getSession(req, res);
        const response = await fetch(`${process.env.AUTH0_AUDIENCE}users/${session.user.sub}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization
          },
          body: JSON.stringify(req.body, null, 2)
        });
        const data = await response.json();

        if (response.ok) {
          await updateSession(req, res, { ...session, user: { ...session.user, ...req.body } });

          return res.status(200).json(data);
        }

        res.status(response.status).json(data);
        break;
      }
      default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(error.response.status || 500).json(error.response.data);
  }
});
