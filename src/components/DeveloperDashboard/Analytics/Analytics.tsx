import { FC, memo, useCallback } from 'react';
import RoutesList from './RoutesList/RoutesList';
import { requestWithError } from '@utils/requestWithError';
import { useLocale } from '@hooks/useLocale';
import { useRouter } from 'next/router';
import { ConfirmModal } from '@ui/modals';
import ActivityGraph from './ActivityGraph/ActivityGraph';

const Analytics: FC<{}> = ({}) => {
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
