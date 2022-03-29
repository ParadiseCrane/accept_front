import { ITableColumn } from '@custom-types/ITable';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  TriangleDownIcon,
  TriangleUpIcon,
} from '@modulz/radix-icons';
import styles from './column.module.css';

const getCurrentOrder = (
  currentOrder: number,
  allowMiddleState: boolean
): -1 | 0 | 1 => {
  if (!allowMiddleState) {
    return -currentOrder as -1 | 1;
  } else {
    switch (currentOrder) {
      case -1:
        return 0;
      case 0:
        return 1;
      case 1:
        return -1;
      default:
        return 0;
    }
  }
};

const Column: FC<{
  column: ITableColumn;
  onSort: (key: string, order: -1 | 0 | 1) => void;
  classNames: any;
}> = ({ column, onSort, classNames }) => {
  const [currentOrder, setCurrentOrder] = useState(
    !column.allowMiddleState && column.sorted == 0 ? 1 : column.sorted
  );

  const nextOrder = useCallback(() => {
    const newOrder = getCurrentOrder(
      currentOrder,
      column.allowMiddleState
    );
    setCurrentOrder(newOrder);
    onSort(column.key, newOrder);
  }, [column.allowMiddleState, onSort, column.key, currentOrder]);

  useEffect(() => {
    setCurrentOrder(
      !column.allowMiddleState && column.sorted == 0
        ? 1
        : column.sorted
    );
  }, [column.allowMiddleState, column.sorted]);

  return (
    <th
      className={classNames[column.key] + ' ' + classNames.headerCell}
      onClick={column.sortable ? nextOrder : () => {}}
    >
      <div className={styles.label}>{column.label}</div>
      {column.sortable && (
        <div className={styles.sortIcon}>
          {currentOrder === 1 ? (
            <TriangleDownIcon width={22} height={22} />
          ) : currentOrder === -1 ? (
            <TriangleUpIcon width={22} height={22} />
          ) : (
            <></>
          )}
        </div>
      )}
    </th>
  );
};

export default memo(Column);
