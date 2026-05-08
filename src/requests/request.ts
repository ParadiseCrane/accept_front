export const withPrefix = (path: string) => `/api/${path}`;

export type availableMethods = "GET" | "PUT" | "POST" | "DELETE";

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
        ru: "Ошибка сети",
        en: "Network error",
      },
    },
  };
};

// Хранилище активных промисов для предотвращения дублирования запросов в один момент времени
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Генерирует уникальный ключ для запроса.
 * Используется для кэширования и дедупликации.
 */
const generateRequestKey = (
  path: string,
  method: string,
  body?: any,
): string => {
  const bodyString = body ? JSON.stringify(body) : "";
  return `${method}:${path}:${bodyString}`;
};

export const sendRequest = <ISend, IReceive>(
  path: string,
  method: availableMethods = "GET",
  body?: ISend extends object ? ISend : object,
  revalidate?: number, // в миллисекундах
): Promise<IResponse<IReceive>> => {
  const key = generateRequestKey(path, method, body);

  // 1. ПРОВЕРКА КЭША (Если данные уже есть в хранилище и не протухли)
  if (revalidate) {
    const cachedData = CheckStorage(key);
    if (cachedData) {
      return Promise.resolve(cachedData as IResponse<IReceive>);
    }
  }

  // 2. ДЕДУПЛИКАЦИЯ (Если такой запрос уже выполняется прямо сейчас)
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }

  // 3. СОЗДАНИЕ НОВОГО ЗАПРОСА
  const requestPromise = (async (): Promise<IResponse<IReceive>> => {
    try {
      let options: RequestInit = {
        credentials: "include",
        method,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      };

      if (body instanceof FormData) {
        // @ts-ignore
        delete options.headers["Content-Type"];
        options.body = body;
      } else if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(withPrefix(path), options);
      const isOk = res.status === 200;

      // Читаем json один раз
      const json = await res.json();

      const result: IResponse<IReceive> = {
        error: !isOk,
        detail: json?.detail,
        response: isOk ? (json as IReceive) : ({} as IReceive),
      };

      // Если запрос успешен и нужен кэш — сохраняем
      if (!result.error && revalidate) {
        SaveInStorage(key, result, revalidate);
      }

      return result;
    } catch (e) {
      // Обработка системных ошибок (сеть, CORS и т.д.)
      return {
        response: {} as IReceive,
        ...processServerError(e),
      } as IResponse<IReceive>;
    } finally {
      // ОБЯЗАТЕЛЬНО: удаляем промис из активных по завершении (успех или провал)
      // чтобы последующие вызовы могли инициировать новый запрос
      inFlightRequests.delete(key);
    }
  })();

  // Регистрируем текущий промис в Map
  inFlightRequests.set(key, requestPromise);

  return requestPromise;
};

export const isSuccessful = <ISend>(
  path: string,
  method: availableMethods,
  body?: ISend extends object ? ISend : object,
): Promise<IPureResponse> => {
  let options: any = {
    credentials: "include",
    method,
    headers: { "content-type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(withPrefix(path), options)
    .then((res) =>
      res.status === 200
        ? { error: false, detail: "" }
        : res.json().then((res) => ({ error: true, detail: res.detail })),
    )
    .catch(processServerError);
};

const CheckStorage = <IReceive>(key: string): IReceive | undefined => {
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
  revalidate: number,
) => {
  const save_data = { data, valid: Date.now() + revalidate };
  window.localStorage.setItem(key, JSON.stringify(save_data));
};
