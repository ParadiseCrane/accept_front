import { getApiUrl } from '@utils/getServerUrl';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTokenCookie } from '@utils/createTokenCookie';
import { getCookieValue } from './cookies';

interface FetchWrapperProps {
  req: NextApiRequest;
  res: NextApiResponse;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  customBody?: any;
  notWriteToRes?: boolean;
}

const refresh_url = `${getApiUrl()}/api/refresh`;

export const fetchWrapper = async (props: FetchWrapperProps) => {
  const { req, res, url, method, customBody, notWriteToRes, ..._ } = props;
  const fetchMethod = method || 'GET';
  const fetch_url = `${getApiUrl()}/${url}`;
  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');
  const fetch_data = {
    method: fetchMethod,
    credentials: 'include' as RequestCredentials,
    body:
      fetchMethod == 'GET'
        ? null
        : customBody
          ? JSON.stringify(customBody)
          : JSON.stringify(req.body),
    headers: {
      'content-type': 'application/json',
      cookie: req.headers.cookie,
      Authorization: `Bearer ${access_token}`,
    } as { [key: string]: string },
  };
  let response = await fetch(fetch_url, fetch_data);

  if (response.status == 401 || response.status == 403) {
    const cookie_user = getCookieValue(req.headers.cookie || '', 'user');
    if (typeof cookie_user !== 'string') {
      if (!!!notWriteToRes) {
        const data = await response.json();

        res.status(response.status).json(data);
      }
      return response;
    }

    const refresh_token = getCookieValue(
      req.headers.cookie || '',
      'refresh_token'
    );

    const refresh_response = await fetch(refresh_url, {
      method: 'GET',
      headers: { refresh_token } as { [key: string]: string },
    });

    if (refresh_response.status !== 200) return;

    const refresh_data = await refresh_response.json();
    res.setHeader('Set-Cookie', [
      createTokenCookie(
        'access_token',
        refresh_data['access_token'],
        new Date(refresh_data['access_token_expires'])
      ),
      createTokenCookie(
        'refresh_token',
        refresh_data['refresh_token'],
        new Date(refresh_data['refresh_token_expires'])
      ),
    ]);
    response = await fetch(fetch_url, {
      ...fetch_data,
      headers: {
        ...fetch_data.headers,
        Authorization: `Bearer ${refresh_data['access_token']}`,
      },
    });
  }

  if (!!!notWriteToRes) {
    const data = await response.json();

    res.status(response.status).json(data);
  }
  return response;
};
