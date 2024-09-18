import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { createTokenCookie } from '@utils/createTokenCookie';

const url = env.API_ENDPOINT + '/api/logout';

export default async function signOut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: { cookie: req.headers.cookie } as {
        [key: string]: string;
      },
    });
    Object.entries(response.headers).forEach((keyArr) =>
      res.setHeader(keyArr[0], keyArr[1] as string)
    );
    res.setHeader('Set-Cookie', [
      createTokenCookie('access_token', '', undefined),
      createTokenCookie('refresh_token', '', undefined),
    ]);
    res.status(200).send('Success');
  } catch {
    res.status(401).json('Error');
  }
}
