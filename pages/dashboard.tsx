import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Row, Col, Card, CardTitle, CardText, Table } from 'reactstrap';

import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import getAccessToken from '../utils/getAccessToken';
import getDateString from '../utils/getDateString';

function Dashboard() {
  const [users, setUsers] = useState<
    {
      created_at: string;
      last_session: string;
      logins_count: number;
      user_id: string;
    }[]
  >([]);
  const [dau, setDAU] = useState(0);
  const [avg, setAVG] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setError(false);
      setIsLoading(true);

      try {
        const accessToken = await getAccessToken();
        const dau = await (
          await fetch(
            `/api/stats/active-users${qs.stringify(
              {
                from: getDateString(Date.now()),
                to: getDateString(Date.now())
              },
              { addQueryPrefix: true }
            )}`,
            {
              signal,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              }
            }
          )
        ).json();
        const avg = await (
          await fetch(
            `/api/stats/active-users${qs.stringify(
              {
                from: getDateString(Date.now() - 6 * 24 * 60 * 60 * 1000),
                to: getDateString(Date.now()),
                aggregation: 'day',
                field: 'logged_in'
              },
              { addQueryPrefix: true }
            )}`,
            {
              signal,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              }
            }
          )
        ).json();
        const results = await (
          await fetch(
            `/api/users${qs.stringify(
              {
                include_fields: true,
                fields: 'user_id,created_at,logins_count'
              },
              { addQueryPrefix: true }
            )}`,
            {
              signal,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              }
            }
          )
        ).json();
        // get user logs and retrieve last one and extract its date
        const data = results.map(async user => {
          const log = (
            await (
              await fetch(
                `/api/logs/${user.user_id}${qs.stringify(
                  {
                    per_page: 1,
                    sort: 'date:-1'
                  },
                  { addQueryPrefix: true }
                )}`,
                {
                  signal,
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                  }
                }
              )
            ).json()
          )[0];

          return { ...user, last_session: log?.date || null };
        });

        setDAU(dau);
        setAVG(avg);
        setUsers(await Promise.all(data));
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    };

    fetchData();

    return () => controller.abort();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      {users && !isLoading && (
        <div className="mb-5" data-testid="dashboard">
          <Row className="mb-5">
            <Col sm="4">
              <Card body>
                <CardTitle tag="p">Number of sign ups</CardTitle>
                <CardText tag="h2">{users.length}</CardText>
              </Card>
            </Col>
            <Col sm="4">
              <Card body>
                <CardTitle tag="p">Number of DAU</CardTitle>
                <CardText tag="h2">{dau}</CardText>
              </Card>
            </Col>
            <Col sm="4">
              <Card body>
                <CardTitle tag="p">Avg. DAU last 7 days</CardTitle>
                <CardText tag="h2">{avg}</CardText>
              </Card>
            </Col>
          </Row>
          <Row>
            <Table responsive>
              <thead>
                <tr>
                  <th>user_id</th>
                  <th>TS of user sign up</th>
                  <th>Num of times logged in</th>
                  <th>TS of the last user session</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_id}>
                    <th scope="row">{user.user_id}</th>
                    <td>{Date.parse(user.created_at)}</td>
                    <td>{user.logins_count || 0}</td>
                    <td>{Date.parse(user.last_session) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </div>
      )}
    </>
  );
}

export default withPageAuthRequired(Dashboard, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
