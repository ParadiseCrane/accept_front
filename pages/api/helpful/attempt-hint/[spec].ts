import { getCookieValue } from '@utils/cookies';
import { fetchWrapper } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function SentAIHintFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/helpful/attempt-hint/${req.query.spec}`,
  //   method: 'GET',
  // });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.status(200).json(true);
}
