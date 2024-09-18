import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { createTokenCookie } from '@utils/createTokenCookie';

const url = env.API_ENDPOINT + '/api/refresh';

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { cookie: req.headers.cookie } as {
        [key: string]: string;
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      res.setHeader('Set-Cookie', [
        createTokenCookie(
          'access_token',
          data['new_access_token'],
          data['new_access_token_max_age']
        ),
      ]);
      return res.status(200).json(data);
    }
    return res.status(401).send('Error');
  } catch {
    res.status(401).json('Error');
  }
}
