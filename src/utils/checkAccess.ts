import {
  IRightsPayload,
  IRulesAction,
  IRulesEntity,
} from '@custom-types/data/rights';

const requestRights = async <T>(
  payload: IRightsPayload,
  headers: { Authorization: string } | undefined,
  pathname: string
): Promise<T | string> => {
  const response = await fetch(`${process.env.API_ENDPOINT}/api/rights`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      Authorization: headers?.Authorization || '',
    },
  });

  if (response.status === 401) {
    return `/signin?referrer=${pathname}`;
  }
  if (response.status === 403) {
    return '/403';
  }
  if (response.status !== 200) return `/500`;

  return await response.json();
};

export const checkWrapper =
  (action: IRulesAction, entity?: IRulesEntity) =>
  (
    entity_spec: string | undefined,
    headers: { Authorization: string } | undefined,
    pathname: string,
    _searchParams?: any
  ) =>
    requestRights<boolean>(
      {
        action,
        entity_spec,
        entity: entity,
      },
      headers,
      pathname
    );
