type AccessType = 'read' | 'write';

const requestRights = async <T>(
  type: AccessType,
  target: string,
  headers: { Cookie: string } | undefined,
  pathname: string
): Promise<T | string> => {
  const response = await fetch(
    `${process.env.API_ENDPOINT}/api/rights/${type}/${target}`,
    {
      method: 'GET',
      headers: headers,
    }
  );

  if (response.status === 401) {
    return `/signin?referrer=${pathname}`;
  }
  if (response.status === 403) {
    return '/403';
  }
  if (response.status !== 200) return `/500`;

  return await response.json();
};

export const checkWrite = async (
  target: string,
  headers: { Cookie: string } | undefined,
  pathname: string,
  _searchParams?: any
): Promise<boolean | string> => {
  const response = await requestRights<boolean>(
    'write',
    target,
    headers,
    pathname
  );
  return response;
};

export const checkRead = async (
  target: string,
  headers: { Cookie: string } | undefined,
  pathname: string,
  _searchParams?: any
): Promise<boolean | string> => {
  const response = await requestRights<boolean>(
    'read',
    target,
    headers,
    pathname
  );
  return response;
};

export const checkTestRights = async (
  target: string,
  headers: { Cookie: string } | undefined,
  pathname: string,
  _searchParams?: any
): Promise<boolean | string> => {
  const response = await fetch(
    `${process.env.API_ENDPOINT}/api/test-rights/${target}`,
    {
      method: 'GET',
      headers: headers,
    }
  );

  if (response.status === 401) {
    return `/signin?referrer=${pathname}`;
  }
  if (response.status === 403) {
    return '/403';
  }
  if (response.status !== 200) return `/500`;

  return await response.json();
};
