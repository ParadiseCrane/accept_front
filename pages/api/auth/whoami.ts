import { getCookieValue } from '@utils/cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';

const url = env.API_ENDPOINT + '/api/whoami';

export default async function whoami(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let cookies = req.headers.cookie || '';
    const access_token = getCookieValue(cookies, 'access_token');

    const response = await fetch(url, {
      headers: req.headers as {
        [key: string]: string;
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return res.status(200).send(data);
    }
    return res.status(401).send('Error');
  } catch (e) {
    if (e instanceof TypeError) return res.status(400).send('Error');
    res.status(500).send('Error');
  }
}
