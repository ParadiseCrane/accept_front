import { FC, memo } from 'react';
import { setter } from '@custom-types/ui/atomic';
import { Button } from '@ui/basics';
import styles from './isCreate.module.css';

const IsCreate: FC<{
  setIsCreate: setter<boolean>;
}> = ({ setIsCreate }) => {
  return (
    <>
      <div>Вы хотите создать команду или присоединиться?</div>
      <div className={styles.buttons}>
        <Button onClick={() => setIsCreate(true)}>Создать</Button>
        <Button onClick={() => setIsCreate(false)}>
          Присоединиться
        </Button>
      </div>
    </>
  );
};

export default memo(IsCreate);
