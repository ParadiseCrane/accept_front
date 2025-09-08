'use server';

import { getApiUrl } from '@utils/getServerUrl';
import { cookies } from 'next/headers';

export const fetchWrapperStaticApp = async ({
  url,
  method = 'GET',
  body = undefined,
  auth = true,
  cacheTags = undefined,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  auth?: boolean;
  cacheTags?: string[];
}) => {
  const cookieStore = await cookies();

  const access_token = auth
    ? cookieStore.get('access_token')?.value
    : undefined;

  const headersObj: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth && access_token) {
    headersObj['Authorization'] = `Bearer ${access_token}`;
  }

  // Prepare fetch options
  const fetchOptions: Record<string, any> = {
    method,
    credentials: 'include',
    headers: headersObj,
    cache: 'no-store', // Similar to getServerSideProps behavior
  };

  if (!['GET', 'DELETE'].includes(method) && body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (cacheTags) {
    fetchOptions.cache = 'force-cache';
    fetchOptions.next = {
      tags: cacheTags,
      revalidate: 30,
    };
  }

  // Get API base URL
  const apiUrl = getApiUrl();

  return await fetch(`${apiUrl}/api/${url}`, fetchOptions);
};
