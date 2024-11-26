import { getCookieValue } from '@utils/cookies';
import { fetchWrapper } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function Image(req: NextApiRequest, res: NextApiResponse) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/image_temp`, //TODO: temp!
    method: 'POST',
  });
  // const fetch_url = `${getApiUrl()}/api/image`;
  // const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  // let response = await fetch(fetch_url, {
  //   // TODO: error with content-length
  //   method: 'POST',
  //   credentials: 'include' as RequestCredentials,
  //   body: req.body,
  //   headers: {
  //     ...req.headers,
  //     Authorization: `Bearer ${access_token}`,
  //   } as unknown as { [key: string]: string },
  // });
  // return response;
}
