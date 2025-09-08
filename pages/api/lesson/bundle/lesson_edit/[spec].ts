import {
  ICourseListItem,
  ILesson,
  ILessonEditBundle,
} from "@custom-types/data/ICourse";
import { getCookieValue } from "@utils/cookies";
import { fetchWrapper } from "@utils/fetchWrapper";
import { getApiUrl } from "@utils/getServerUrl";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetLessonEditBundle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/bundle/lesson-edit/${req.query.spec}`,
    method: "GET",
  });

  // const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  // const fetch_data = {
  //   method: 'GET',
  //   // eslint-disable-next-line no-undef
  //   credentials: 'include' as RequestCredentials,
  //   headers: {
  //     'content-type': 'application/json',
  //     Authorization: `Bearer ${access_token}`,
  //   } as { [key: string]: string },
  // };
  // const response = await fetch(
  //   `${getApiUrl()}/api/bundle/lesson-edit/${req.query.spec}`,
  //   fetch_data
  // );

  // const responseData: ILessonEditBundle = await response.json();

  // const newData: ILessonEditBundle = {
  //   ...responseData,
  //   lesson: {
  //     ...responseData.lesson,
  //     // TODO mocked method
  //     allowedLanguages: [],
  //     forbiddenLanguages: [],
  //   },
  // };

  // res.status(response.status).json(newData);
}
