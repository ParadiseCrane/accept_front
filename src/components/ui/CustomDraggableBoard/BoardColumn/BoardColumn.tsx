import React, { FC, ReactNode, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  CustomDraggableBoardClassNames,
  IDraggableBoardItem,
} from '@custom-types/ui/IDraggableBoard';
import ItemList from '../ItemList/ItemList';
import styles from './boardColumn.module.css';
import { concatClassNames } from '@utils/concatClassNames';

const BoardColumn: FC<{
  label: ReactNode;
  id: string;
  columnIndex: number;
  items: IDraggableBoardItem[];
  classNames?: CustomDraggableBoardClassNames;
}> = ({ label, columnIndex, id, items, classNames }) => {
  return (
    <Draggable draggableId={id} index={columnIndex}>
      {(provided, snapshot) => (
        <div
          className={`${concatClassNames(
            styles.wrapper,
            classNames?.columnWrapper
          )} ${
            snapshot.isDragging
              ? concatClassNames(
                  styles.draggingWrapper,
                  classNames?.columnWrapperDragging
                )
              : ''
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>
            <div
              {...provided.dragHandleProps}
              className={`${concatClassNames(
                styles.labelWrapper,
                classNames?.columnLabelWrapper
              )} ${
                snapshot.isDragging
                  ? concatClassNames(
                      styles.draggingLabel,
                      classNames?.columnLabelDragging
                    )
                  : ''
              }`}
            >
              {label}
            </div>
          </div>
          <ItemList id={id} items={items} />
        </div>
      )}
    </Draggable>
  );
};

export default memo(BoardColumn);
