import { ICourseListItem } from '@custom-types/data/ICourse';
import { getCookieValue } from '@utils/cookies';
import { fetchWrapper } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';

function getRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

export default async function GetCourseList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO mocked method
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/course`,
    method: 'GET',
  });
}
