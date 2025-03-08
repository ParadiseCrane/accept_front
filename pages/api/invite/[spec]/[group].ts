import { IGroupInvite } from '@custom-types/data/IGroup';
import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function InviteCourseGroup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/invite/${req.query.spec}/${req.query.group}`,
  });
}
