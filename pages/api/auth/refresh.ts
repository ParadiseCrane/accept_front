import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { createTokenCookie } from '@utils/createTokenCookie';
import { getCookieValue } from '@utils/cookies';

const url = env.API_ENDPOINT + '/api/refresh';

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let cookies = req.headers.cookie || '';
  const refresh_token = getCookieValue(cookies, 'refresh_token');

  const response = await fetch(url, {
    method: 'GET',
    headers: { refresh_token } as {
      [key: string]: string;
    },
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
        'refresh_token',
        data['refresh_token'],
        new Date(data['refresh_token_expires'])
      ),
    ]);
    return res.status(200).json(data);
  }
  return res.status(401).send('Error');
}
