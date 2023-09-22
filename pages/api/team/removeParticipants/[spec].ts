import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function RemoveParticipantsFromTeam(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/team/remove_participants/${req.query.spec}`,
    method: 'POST',
  });
}
