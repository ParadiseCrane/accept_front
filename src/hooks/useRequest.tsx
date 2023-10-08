import { callback, optionalCallback } from '@custom-types/ui/atomic';
import {
  IResponse,
  availableMethods,
  sendRequest,
} from '@requests/request';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface IRequestData<Answer, ReqAnswer = Answer> {
  data: Answer | undefined;
  loading: boolean;
  error: boolean;
  detail: object;
  refetch: optionalCallback<boolean, Promise<IResponse<ReqAnswer>>>;
}

export function useRequest<Body, ReqAnswer, Answer = ReqAnswer>(
  url: string,
  method?: availableMethods,
  body?: Body extends object ? Body : object,
  processData?: callback<ReqAnswer, Answer>,
  onSuccess?: callback<any>,
  onError?: callback<any>,
  revalidate?: number
): IRequestData<Answer, ReqAnswer> {
  const process = useMemo(
    () => (processData ? processData : (a: any) => a),
    [processData]
  );
  const [data, setData] = useState<Answer>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState({});

  const refetch = useCallback(
    (shouldSetLoading?: boolean) => {
      if (shouldSetLoading) setLoading(true);
      setError(false);
      setDetail('');

      return sendRequest<Body, ReqAnswer>(
        url,
        method || 'GET',
        body,
        revalidate
      ).then((res) => {
        if (!res.error) {
          setData(process(res.response));
          if (onSuccess) onSuccess(res);
        } else {
          setError(true);
          setDetail(res.detail);
          if (onError) onError(res);
        }
        if (shouldSetLoading) setLoading(false);

        return res;
      });
    },
    [body, method, onError, onSuccess, process, revalidate, url]
  );

  useEffect(() => {
    refetch(true);
  }, []); //eslint-disable-line

  return { data, loading, error, detail, refetch };
}
