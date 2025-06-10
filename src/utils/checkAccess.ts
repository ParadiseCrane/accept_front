import { IResponseErrorObject } from '@custom-types/data/atomic';
import {
  IRightsPayload,
  IRulesAction,
  IRulesEntity,
} from '@custom-types/data/rights';
import { jwtVerify, type JWTPayload } from 'jose';

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
  }).catch((reason) => {
    if (process.env.NODE_ENV == 'production') {
      return new Response(
        JSON.stringify({
          error: 'Service temporarily unavailable',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    throw reason;
  });

  if (response.status === 401) {
    return { hasError: true, errorCode: 401 } as T;
  }
  if (response.status === 403) {
    return { hasError: true, errorCode: 403 } as T;
  }
  if (response.status !== 200) return { hasError: true, errorCode: 500 } as T;

  return await response.json();
};

const get_access_level = async (
  access_token: string
): Promise<number | undefined> => {
  let { payload } = await jwtVerify(
    access_token,
    new TextEncoder().encode(
      '$2b$12$FHcPTliMVqLcujuHbCDbXORht.yKxOBo4fZ8FqlJSs6levQ3oeJ5G'
    )
  );
  if (typeof payload['access_level'] === 'number') {
    return payload['access_level'];
  }
  return undefined;
};

export const checkWrapper =
  (
    action: IRulesAction,
    entity: IRulesEntity,
    access_requirements: number,
    strict: boolean = false
  ) =>
  async (
    entity_spec: string | undefined,
    access_token: string | undefined,
    pathname: string,
    _searchParams?: any
  ) => {
    if (access_token !== undefined) {
      let data = await get_access_level(access_token);
      let access_level = data || 0;
      if (access_requirements <= access_level) {
        return true;
      }
      if (strict) {
        return false;
      }
    }
    return requestRights<IResponseErrorObject>(
      {
        action,
        entity_spec,
        entity: entity,
      },
      access_token ? { Authorization: `Bearer ${access_token}` } : undefined,
      pathname
    );
  };
