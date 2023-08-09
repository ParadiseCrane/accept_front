export const withPrefix = (path: string) => `/api/${path}`;

export type availableMethods = 'GET' | 'PUT' | 'POST' | 'DELETE';

export interface IResponse<T> {
  error: boolean;
  detail: any;
  response: T;
}
export interface IPureResponse {
  error: boolean;
  detail: any;
}

const processServerError = (e: any) => {
  console.error(e);
  return {
    error: true,
    detail: {
      description: {
        ru: 'Ошибка сети',
        en: 'Network error',
      },
    },
  };
};

export const sendRequest = <ISend, IReceive>(
  path: string,
  method: availableMethods,
  body?: ISend extends object ? ISend : object,
  revalidate?: number // milliseconds
): Promise<IResponse<IReceive>> => {
  if (revalidate) {
    const data = CheckStorage(path + JSON.stringify(body));
    if (data) {
      return Promise.resolve(data as IResponse<IReceive>);
    }
  }

  let options: any = {
    credentials: 'include',
    method,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(withPrefix(path), options)
    .then((res: any) =>
      res.status === 200
        ? res.json().then((res: any) => ({
            error: false,
            detail: res.detail,
            response: res as IReceive,
          }))
        : res.json().then((res: any) => ({
            error: true,
            detail: res.detail,
            response: {},
          }))
    )
    .then((res) => {
      revalidate
        ? SaveInStorage(path + JSON.stringify(body), res, revalidate)
        : null;
      return res as unknown as IResponse<IReceive>;
    })
    .catch((e) => {
      return {
        response: {},
        ...processServerError(e),
      } as IResponse<IReceive>;
    });
};

export const isSuccessful = <ISend>(
  path: string,
  method: availableMethods,
  body?: ISend extends object ? ISend : object
): Promise<IPureResponse> => {
  let options: any = {
    credentials: 'include',
    method,
    headers: { 'content-type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(withPrefix(path), options)
    .then((res) =>
      res.status === 200
        ? { error: false, detail: '' }
        : res
            .json()
            .then((res) => ({ error: true, detail: res.detail }))
    )
    .catch(processServerError);
};

const CheckStorage = <IReceive>(
  key: string
): IReceive | undefined => {
  const valueString = window.localStorage.getItem(key);
  if (!valueString) {
    return undefined;
  }
  const value = JSON.parse(valueString);
  if (value.valid < Date.now()) {
    window.localStorage.removeItem(key);
    return undefined;
  }

  return value.data;
};

const SaveInStorage = (
  key: string,
  data: object | undefined,
  revalidate: number
) => {
  const save_data = { data, valid: Date.now() + revalidate };
  window.localStorage.setItem(key, JSON.stringify(save_data));
};
