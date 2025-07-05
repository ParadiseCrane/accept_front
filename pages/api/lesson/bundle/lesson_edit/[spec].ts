import {
  ICourseListItem,
  ILesson,
  ILessonEditBundle,
} from '@custom-types/data/ICourse';
import { getCookieValue } from '@utils/cookies';
import { fetchWrapper } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GetLessonEditBundle(
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
  const response = await fetch(
    `${getApiUrl()}/api/course/${req.query.spec}`,
    fetch_data
  );

  const responseData: ILesson = await response.json();

  const newData: ILessonEditBundle = {
    lesson: {
      ...responseData,
      tasks: [
        {
          spec: '1516a6df-2eca-4d9d-8705-395d2d5f3a1d',
          organization: 'public',
          title: 'Максимальная и минимальная цифра числа',
          author: 'avu',
          tags: [
            {
              spec: 'f5c053b7-d3af-473a-bf5e-7edc3c905ace',
              organization: 'public',
              title: 'Задачи ВМЛ',
              predefined: true,
            },
            {
              spec: '9bbad80f-216f-4f22-8ade-dfdcfe02bd3a',
              organization: 'public',
              title: 'Цикл с условием',
              predefined: true,
            },
          ],
          verdict: {
            spec: 2,
            fullText: 'Wrong Answer',
            shortText: 'WA',
          },
          insertedDate: new Date('2022-12-24T11:18:16.885000'),
          complexity: 58,
        },
      ],
      allowedLanguages: [],
      forbiddenLanguages: [],
    },
    tags: [
      {
        spec: '96b51152-856f-4785-90f4-089f628dd15c',
        organization: 'vml',
        title: 'командный',
        predefined: false,
      },
      {
        spec: '30514beb-a260-4753-8f13-4bf6736c0e6f',
        organization: 'vml',
        title: 'личный',
        predefined: false,
      },
      {
        spec: 'c8a45c5c-6a57-4e9c-9510-52a1062a0906',
        organization: 'vml',
        title: 'пробный',
        predefined: false,
      },
    ],
    assessmentTypes: [
      {
        spec: 1,
        name: 'perTask',
      },
      {
        spec: 0,
        name: 'perTest',
      },
    ],
  };

  res.status(response.status).json(newData);
}
