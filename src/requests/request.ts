import { DEFAULT_REQUEST_CACHE_TIME } from "@constants/Limits";
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

/**
 * Единый метод для всех запросов в приложении.
 * Инкапсулирует логику сетевых вызовов и кэширования через TanStack Query.
 */
export const sendRequest = async <ISend, IReceive>(
  path: string,
  method: availableMethods = "GET",
  body?: ISend extends object ? ISend : object,
  revalidate?: number | boolean,
): Promise<IResponse<IReceive>> => {
  // 1. Вычисляем интервал валидности (staleTime)
  const revalidateInterval: number | undefined = (() => {
    if (typeof revalidate === "boolean") {
      return revalidate ? DEFAULT_REQUEST_CACHE_TIME : undefined;
    }
    if (typeof revalidate === "number") {
      return revalidate;
    }
    return undefined;
  })();

  // 2. Логика кэширования:
  // Кэшируем GET по умолчанию, либо любой метод (в т.ч. POST-фильтрацию), если передан revalidate.
  const isCacheable = method === "GET" || revalidateInterval !== undefined;

  if (isCacheable) {
    // TanStack fetchQuery берет на себя:
    // - Проверку своего кэша в памяти (staleTime)
    // - Дедупликацию (если два вызова произошли одновременно, будет один сетевой запрос)
    return queryClient.fetchQuery({
      queryKey: [method, path, body],
      queryFn: () => performNetworkRequest<ISend, IReceive>(path, method, body),
      staleTime: revalidateInterval || 0,
    });
  }

  // 3. Прямой вызов для действий (POST/PUT/DELETE без кэширования)
  return performNetworkRequest<ISend, IReceive>(path, method, body);
};

/**
 * Низкоуровневая функция выполнения сетевого запроса.
 */
const performNetworkRequest = async <ISend, IReceive>(
  path: string,
  method: string,
  body?: ISend extends object ? ISend : object,
): Promise<IResponse<IReceive>> => {
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
    const json = await res.json();
    const isOk = res.status === 200;

    return {
      error: !isOk,
      detail: json?.detail,
      response: isOk ? (json as IReceive) : ({} as IReceive),
    };
  } catch (e) {
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
  return queryClient.invalidateQueries({ queryKey: [method, path, body] });
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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      gcTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
