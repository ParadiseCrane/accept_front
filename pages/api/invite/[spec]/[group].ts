import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function InviteCourseGroup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == 'GET') {
    await fetchWrapper({
      req: req,
      res: res,
      url: `api/invite/${req.query.spec}/${req.query.group}`,
      method: 'GET',
    });
  } else {
    await fetchWrapper({
      req: req,
      res: res,
      url: `api/invite/${req.query.spec}/${req.query.group}`,
      method: 'POST',
    });
  }
}
