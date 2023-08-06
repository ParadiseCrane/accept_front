import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function PostTaskTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/task_tests/${req.query.task_spec}/${req.query.insert_index}`,
    method: 'POST',
  });
}
