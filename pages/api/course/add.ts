import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function AddCourse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetchWrapper({
    req: req,
    res: res,
    url: `api/course`,
    method: 'POST',
  });
  console.log('add course response', response);
}
