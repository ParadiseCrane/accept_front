import { pureCallback } from '@custom-types/ui/atomic';
import { Item } from '@custom-types/ui/atomic';

import { FC } from 'react';
import styles from './languageItem.module.css';
import inputStyles from '@styles/ui/input.module.css';

export const LanguageItem: FC<{
  item: Item;
  onSelect: pureCallback<void>;
  shrink?: boolean;
}> = ({ item, onSelect, shrink }) => {
  return (
    <div
      className={`${styles.itemWrapper} ${
        shrink ? inputStyles.shrink : ''
      }`}
    >
      <div className={styles.item} onClick={() => onSelect()}>
        <div className={inputStyles.label}>{item.label}</div>
      </div>
    </div>
  );
};
