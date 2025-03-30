import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function DeleteCourseModerator(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO добавить реальный запрос
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/course_moderator/${req.query.spec}`,
  // });
  res.status(200).json({ message: 'Delete success' });
}
