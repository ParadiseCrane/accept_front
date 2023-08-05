import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';

import {
  IResponse,
  availableMethods,
  sendRequest,
} from '@requests/request';
import { IAvailableLang } from '@custom-types/ui/ILocale';

const defaultAutoClose = 5000;

export const requestWithError = <T, V>(
  endpoint: string,
  method: availableMethods,
  locale: {
    loading: string;
    error: string;
  },
  lang: IAvailableLang,
  body?: T extends object ? T : object,
  onSuccess?: (_: V) => void | Promise<void>,
  params?: any
): Promise<IResponse<V>> =>
  sendRequest<T, V>(endpoint, method, body).then((res) => {
    if (!res.error) {
      if (onSuccess) onSuccess(res.response);
    } else {
      const id = newNotification({
        title: locale.loading,
        message: locale.loading + '...',
        autoClose: defaultAutoClose,
        ...params,
      });
      errorNotification({
        id,
        title: locale.error,
        message: res.detail.description
          ? res.detail.description[lang]
          : res.detail,
        autoClose: defaultAutoClose,
        ...params,
      });
    }
    return res;
  });
