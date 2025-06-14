import { IModeratorGroupPair } from '@custom-types/data/ICourse';
import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function CourseModeratorGroup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/course/moderator_group/${req.query.spec}`,
  });
}
