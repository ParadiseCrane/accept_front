import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { createTokenCookie } from '@utils/createTokenCookie';

const url = env.API_ENDPOINT + '/api/login';

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const headers = {
      'content-type': 'application/json',
      cookie: req.headers.cookie,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers as { [key: string]: string },
      body: JSON.stringify(req.body),
    });
    if (response.status === 200) {
      const data = await response.json();
      res.setHeader('Set-Cookie', [
        createTokenCookie(
          'access_token_cookie',
          data['access_token'],
          data['access_token_max_age']
        ),
        createTokenCookie(
          'refresh_token_cookie',
          data['refresh_token'],
          data['refresh_token_max_age']
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
