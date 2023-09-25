import { Item } from '@custom-types/ui/atomic';

import { FC } from 'react';
import OpenTask from './OpenTask/OpenTask';
import styles from './taskItem.module.css';
import { pureCallback } from '@custom-types/ui/atomic';

export const TaskItem: FC<{
  item: Item;
  onSelect: pureCallback<void>;
}> = ({ item, onSelect }) => {
  return (
    <div className={styles.itemWrapper}>
      <div className={styles.item} onClick={() => onSelect()}>
        <div className={styles.label}>{item.title}</div>
      </div>
      <div className={styles.actions}>
        <OpenTask spec={item.spec} />
      </div>
    </div>
  );
};
