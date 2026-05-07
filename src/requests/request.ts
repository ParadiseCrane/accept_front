import { QueryClient } from "@tanstack/react-query";
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

/**
 * sendRequest analog with caching by Tanstack.
 */
export const sendTanstackRequest = async <ISend, IReceive>(
  path: string,
  method: availableMethods = "GET",
  body?: ISend extends object ? ISend : object,
  revalidate?: number | boolean,
): Promise<IResponse<IReceive>> => {
  const REVALIDATE_DEFAULT_VALUE = 1 * 60 * 1000;
  // Ключ для TanStack
  const key = [method, path, body];

  const revalidateInterval: number | undefined = (() => {
    if (typeof revalidate === "boolean") {
      if (revalidate) return REVALIDATE_DEFAULT_VALUE;
    }
    if (typeof revalidate === "number") {
      return revalidate;
    }
    return undefined;
  })();

  // ЛОГИКА ОПРЕДЕЛЕНИЯ: НУЖЕН ЛИ КЭШ
  // Кэшируем если это GET ИЛИ если явно передан revalidate
  const isCacheable = method === "GET" || revalidateInterval;

  if (isCacheable) {
    return queryClient.fetchQuery({
      queryKey: key,
      queryFn: () => performNetworkRequest<ISend, IReceive>(path, method, body),
      staleTime: revalidateInterval || 0,
    });
  }

  // Если это действие (POST/PUT/DELETE без revalidate),
  // просто выполняем запрос без участия TanStack Query
  return performNetworkRequest<ISend, IReceive>(path, method, body);
};

/**
 * Чистая функция для выполнения сетевого запроса без участия кэширования.
 * Используется как внутри TanStack Query, так и для прямых запросов (действий).
 */
const performNetworkRequest = async <ISend, IReceive>(
  path: string,
  method: string,
  body?: ISend extends object ? ISend : object,
): Promise<IResponse<IReceive>> => {
  try {
    let options: RequestInit = {
      credentials: "include", // Важно для твоих сессий/кук
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    // Обработка FormData (для загрузки файлов) или обычного JSON
    if (body instanceof FormData) {
      // Браузер сам выставит правильный Boundary для FormData,
      // поэтому удаляем заголовок Content-Type
      // @ts-ignore
      delete options.headers["Content-Type"];
      options.body = body;
    } else if (body) {
      options.body = JSON.stringify(body);
    }

    // withPrefix — твоя функция добавления базового URL (api.example.com/...)
    const res = await fetch(withPrefix(path), options);

    // Пытаемся распарсить JSON. Если бэкенд возвращает пустой ответ на DELETE или 204,
    // стоит добавить проверку на пустой body, но обычно у тебя идет JSON.
    const json = await res.json();
    const isOk = res.status === 200;

    return {
      error: !isOk,
      detail: json?.detail, // Предполагаем, что бэкенд отдает описание ошибки здесь
      response: isOk ? (json as IReceive) : ({} as IReceive),
    };
  } catch (e) {
    // processServerError — твоя функция обработки исключений (сеть, CORS, таймаут)
    return {
      response: {} as IReceive,
      ...processServerError(e),
    } as IResponse<IReceive>;
  }
};

/**
 * Функция для ручной очистки кэша TanStack Query по определенному ключу.
 * Может быть полезна после успешного POST/PUT/DELETE, чтобы гарантировать свежесть данных при следующем GET.
 * @param path
 * @param method - optional, если не указан, очистит все запросы с данным path независимо от метода
 * @param body - optional, для более точечной очистки, если указано, удалит только запросы с совпадающим body
 */
export const clearRequestCache = (
  path: string,
  method?: availableMethods,
  body?: any,
) => {
  queryClient.invalidateQueries({ queryKey: [method, path, body] });
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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
      gcTime: 1000 * 40,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
