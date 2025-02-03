import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GetImagePresetByKind(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    method: 'GET',
    url: `api/images_preset/${req.query.kind}?name=ML`,
  });
}
