import { getCookieValue } from '@utils/cookies';
import { getApiUrl } from '@utils/getServerUrl';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiUrl = `${getApiUrl()}/api/image/${req.query.spec}`;
    const accessToken = getCookieValue(req.headers.cookie || '', 'access_token');


    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,

        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: req.method !== 'GET' ? req : undefined,
    });

    if (response.body) {
      res.status(response.status);
      response.body.pipe(res);
      return;
    }

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
