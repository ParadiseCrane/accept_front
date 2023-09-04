import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function PutPinCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    method: req.method as 'GET' | 'PUT',
    url: `api/pin_code/${req.query.origin}`,
  });
}
