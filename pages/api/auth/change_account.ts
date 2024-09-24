import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { createTokenCookie } from '@utils/createTokenCookie';
import { getCookieValue } from '@utils/cookies';

const url = env.API_ENDPOINT + '/api/change_account';

export default async function changeAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let cookies = req.headers.cookie || '';
  const access_token = getCookieValue(cookies, 'access_token');

  const headers = {
    'content-type': 'application/json',
    cookie: cookies,
    Authorization: `Bearer ${access_token}`,
  };

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(req.body),
    headers: headers as { [key: string]: string },
  });
  if (response.status === 200) {
    const data = await response.json();
    res.setHeader('Set-Cookie', [
      createTokenCookie(
        'access_token',
        data['access_token'],
        new Date(data['expiration'])
      ),
    ]);
    return res.status(200).json(data);
  }
  return res.status(401).send('error');
}
