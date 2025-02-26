import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function CourseMain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/course/main/${req.query.spec}`,
  // });
  res.status(200).json({
    title: 'Новое название нового курса',
    description: '<p>Новое описание нового курса</p>',
    image: '66b55d00-257a-428a-a28c-a37ccc906f33',
    invite: 'invite link',
  });
}
