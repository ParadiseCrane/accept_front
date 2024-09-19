import { getCookieValue } from '@utils/cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';

const url = env.API_ENDPOINT + '/api/whoami';

export default async function whoami(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let cookies = req.headers.cookie || '';
  const access_token = getCookieValue(cookies, 'access_token');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (response.status === 200) {
    const data = await response.json();
    return res.status(200).send(data);
  }
  return res.status(401).send('Error');
}
