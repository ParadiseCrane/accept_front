import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function TeamRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/team/${req.query.origin}`,
    method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
  });
}
