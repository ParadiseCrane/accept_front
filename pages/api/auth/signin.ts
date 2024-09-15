import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { createTokenCookie } from '@utils/createTokenCookie';

const url = env.API_ENDPOINT + '/api/login';

const getCookieValue = (cookies: string, name: string) =>
  cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop();

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // We need to send:
  // login -- from user
  // password -- from user
  // organization -- from user
  // session_id (optionally) -- from cookies

  // We will receive:
  // access_token -- to be placed into cookies
  // session_id -- set to cookies

  try {
    const headers = {
      cookie: req.headers.cookie || '',
    };

    const session_id = getCookieValue(
      req.headers.cookie || '',
      'session_id'
    );

    let data = new FormData();

    data.append('client_id', req.body.organization);
    data.append('username', req.body.login);
    data.append('password', req.body.password);
    if (session_id) data.append('client_secret', session_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers as { [key: string]: string },
      body: data,
    });
    if (response.status === 200) {
      const data = await response.json();
      res.setHeader('Set-Cookie', [
        createTokenCookie(
          'access_token',
          data['access_token'],
          new Date(data['access_token_expires'])
        ),
        createTokenCookie(
          'session_id',
          data['session_id'],
          undefined
        ),
      ]);
      return res.status(200).send('Success');
    }
    return res.status(401).send('error');
  } catch (e) {
    console.error(e);

    if (e instanceof TypeError) return res.status(400).send('Error');
    res.status(400).send('Error');
  }
}
