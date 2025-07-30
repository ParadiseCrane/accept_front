import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function AddLessonTask(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO mocked method, Саня сделал, надо заменить
  // и я хз, как, потому что он сделал два spec
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/lesson/task/${req.query.spec}`,
    method: 'POST',
  });
}
