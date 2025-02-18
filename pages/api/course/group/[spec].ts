import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function CourseGroup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // res.status(200).json([]);
  res.status(200).json([
    {
      spec: '25',
      name: 'Group 1',
    },
    {
      spec: '34',
      name: 'Group 2',
    },
    {
      spec: '47',
      name: 'Group 3',
    },
    {
      spec: '59',
      name: 'Group 4',
    },
  ]);
}
