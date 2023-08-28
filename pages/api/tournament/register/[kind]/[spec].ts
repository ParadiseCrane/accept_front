import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function RegisterForTournament(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/tournament-register/${req.query.kind}/${req.query.spec}`,
    method: req.query.kind == 'open' ? 'GET' : 'POST',
  });
}
