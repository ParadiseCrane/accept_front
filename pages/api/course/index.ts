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
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/course`,
  //   method: 'GET',
  // });

  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  const fetch_data = {
    method: 'GET',
    // eslint-disable-next-line no-undef
    credentials: 'include' as RequestCredentials,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    } as { [key: string]: string },
  };
  const response = await fetch(`${getApiUrl()}/api/course`, fetch_data);

  const responseData: ICourseListItem[] = await response.json();

  const newData: ICourseListItem[] = responseData.map(
    (course: ICourseListItem) =>
      ({
        ...course,
        date: getRandomDate(new Date(2024, 1, 1), new Date(2025, 12, 31)),
        numOfModules: Math.round(Math.random() * (20 - 5) + 5),
      }) as ICourseListItem
  );

  res.status(response.status).json(newData);
}
