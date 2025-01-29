import { useLocale } from '@hooks/useLocale';
import { ConfirmModal } from '@ui/modals';
import { requestWithError } from '@utils/requestWithError';
import { useRouter } from 'next/router';
import { FC, memo, useCallback } from 'react';

import ActivityGraph from './ActivityGraph/ActivityGraph';
import RoutesList from './RoutesList/RoutesList';

const Analytics: FC<{}> = () => {
  const { locale, lang } = useLocale();
  const router = useRouter();
  const clearAnalytics = useCallback(() => {
    requestWithError<undefined, boolean>(
      'analytics/delete',
      'GET',
      locale.notify.analytics.delete,
      lang
    ).then((res) => {
      if (!res.error) {
        router.reload();
      }
    });
  }, [lang, locale, router]);

  return (
    <div>
      <ConfirmModal
        confirm={clearAnalytics}
        buttonText={locale.delete}
        kind={'negative'}
      />
      <ActivityGraph />
      <RoutesList />
    </div>
  );
};

export default memo(Analytics);
