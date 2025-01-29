import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Button } from '@ui/basics';
import { FC, memo } from 'react';

import styles from './isCreate.module.css';

const IsCreate: FC<{
  setIsCreate: setter<boolean>;
}> = ({ setIsCreate }) => {
  const { locale } = useLocale();

  return (
    <>
      <div className={styles.buttons}>
        <Button variant="outline" onClick={() => setIsCreate(true)}>
          {locale.tournament.registration.isCreate.createButton}
        </Button>
        <Button variant="outline" onClick={() => setIsCreate(false)}>
          {locale.tournament.registration.isCreate.joinButton}
        </Button>
      </div>
    </>
  );
};

export default memo(IsCreate);
