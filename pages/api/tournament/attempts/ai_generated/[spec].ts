import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import { getCookieValue } from '@utils/cookies';
import { fetchWrapper } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function TournamentAttemptsAIGenerated(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/attempt/tournament/ai_generated/${req.query.spec}`,
  //   method: 'POST',
  // });

  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  const fetch_data = {
    method: 'POST',
    // eslint-disable-next-line no-undef
    credentials: 'include' as RequestCredentials,
    body:
      !['GET', 'DELETE'].includes('POST') && req.body
        ? JSON.stringify(req.body)
        : null,
    headers: {
      'content-type': 'application/json',
      // cookie: req.headers.cookie,
      Authorization: `Bearer ${access_token}`,
    } as { [key: string]: string },
  };
  const response = await fetch(
    `${getApiUrl()}/api/attempt/tournament/${req.query.spec}`,
    fetch_data
  );

  const responseData: {
    data: IAttemptDisplay[];
    total: number;
  } = await response.json();

  const newData: {
    data: IAttemptDisplay[];
    total: number;
  } = {
    ...responseData,
    data: responseData.data.map((attempt) => ({
      ...attempt,
      ai_generated: Math.round(Math.random() * (99 - 60) + 60),
    })),
  };

  res.status(response.status).json(newData);
}
