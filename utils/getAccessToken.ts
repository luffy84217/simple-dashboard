import jwt from 'jsonwebtoken';

type SuccessResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
};
type FailResponse = {
  error: string;
  error_description: string;
  error_uri: string;
};

function getAccessToken() {
  async function fetchAccessToken(
    resolve: (value: string | PromiseLike<string>) => void,
    reject: (reason?: any) => void
  ) {
    const res = await fetch('/api/auth/token', {
      method: 'POST'
    });
    const data = (await res.json()) as SuccessResponse | FailResponse;

    if ('error' in data) {
      reject(data);
    } else {
      sessionStorage.setItem('access_token', data.access_token);
      resolve(data.access_token);
    }
  }

  return new Promise<string>(async (resolve, reject) => {
    // if no token is stored in storage, fetch new one
    if (sessionStorage.getItem('access_token') === null) {
      await fetchAccessToken(resolve, reject);
    }
    const accessToken = sessionStorage.getItem('access_token');
    const { exp } = jwt.decode(accessToken) as jwt.JwtPayload;

    // if token stored in storage is expired, fetch new one
    if (Date.now() >= exp * 1000) {
      await fetchAccessToken(resolve, reject);
    }

    // else use it
    resolve(accessToken);
  });
}

export default getAccessToken;
