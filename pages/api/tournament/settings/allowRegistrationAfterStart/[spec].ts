import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function TournamentSetAllowRegistrationAfterStart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/tournament/allow-registration-after-start/${req.query.spec}`,
    method: 'PUT',
  });
}
