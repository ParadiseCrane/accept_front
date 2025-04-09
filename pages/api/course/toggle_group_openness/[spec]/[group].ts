import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function CourseToggleGroupOpenness(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/course/toggle_group_openness/${req.query.spec}?group=${req.query.group}`,
    method: 'PUT',
  });
}
