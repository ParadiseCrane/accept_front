import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO: Remove
export default async function GetChatHosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/chat/hosts/${req.query.entity}`,
    method: 'POST',
  });
}
