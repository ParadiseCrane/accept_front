import AttemptsList from '@components/Dashboard/AttemptsList/AttemptsList';
import { useLocale } from '@hooks/useLocale';
import { Switch } from '@ui/basics';
import { FC, memo, useState } from 'react';
// import styles from './currentAttempts.module.scss'

const CurrentAttempts: FC<{}> = () => {
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const { locale } = useLocale();

  return (
    <>
      <Switch
        checked={shouldRefetch}
        onChange={(event) => setShouldRefetch(event.currentTarget.checked)}
        label={locale.dashboard.developer.currentAttempts.shouldRefetch}
      />
      <AttemptsList
        type={'current'}
        spec={''}
        shouldNotRefetch={!shouldRefetch}
        isFinished={false}
        endDate={new Date()}
      />
    </>
  );
};

export default memo(CurrentAttempts);
