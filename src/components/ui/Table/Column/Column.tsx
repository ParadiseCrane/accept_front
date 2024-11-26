import { ITableColumn } from '@custom-types/ui/ITable';
import { Icon } from '@ui/basics';
import { FC, memo, useCallback, useState } from 'react';
import { Triangle, TriangleInverted } from 'tabler-icons-react';
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
  onSort: (_: string, __: -1 | 0 | 1) => void;
  classNames?: any;
}> = ({ column, onSort, classNames }) => {
  const [currentOrder, setCurrentOrder] = useState(
    !column.allowMiddleState && column.sorted == 0 ? 1 : column.sorted
  );

  const nextOrder = useCallback(() => {
    const newOrder = getCurrentOrder(currentOrder, column.allowMiddleState);
    setCurrentOrder(newOrder);
    onSort(column.key, newOrder);
  }, [column.allowMiddleState, onSort, column.key, currentOrder]);

  return (
    <th
      className={
        styles.header +
        ' ' +
        classNames[column.key] +
        ' ' +
        classNames.headerCell
      }
      onClick={column.sortable ? nextOrder : () => {}}
    >
      <div className={styles.label}>{column.label}</div>
      {column.sortable && (
        <div className={styles.sortIcon}>
          {currentOrder === -1 ? (
            <Icon size="xs">
              <TriangleInverted color="black" />
            </Icon>
          ) : currentOrder === 1 ? (
            <Icon size="xs">
              <Triangle color="black" />
            </Icon>
          ) : (
            <></>
          )}
        </div>
      )}
    </th>
  );
};

export default memo(Column);
