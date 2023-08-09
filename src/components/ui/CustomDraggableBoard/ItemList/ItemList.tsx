import {
  CustomDraggableBoardClassNames,
  IDraggableBoardItem,
} from '@custom-types/ui/IDraggableBoard';
import { FC, memo } from 'react';
import {
  Draggable,
  Droppable,
  DroppableProps,
} from 'react-beautiful-dnd';
import styles from './itemList.module.css';
import { concatClassNames } from '@utils/concatClassNames';

interface ItemListProps
  extends Omit<DroppableProps, 'droppableId' | 'children'> {
  id: string;
  items: IDraggableBoardItem[];
  classNames?: CustomDraggableBoardClassNames;
}

const ItemList: FC<ItemListProps> = ({
  id,
  items,
  classNames,
  ...props
}) => {
  return (
    <Droppable type="ITEM" droppableId={id} {...props}>
      {(dropProvided, _dropSnapshot) => (
        <div
          // isDraggingOver={dropSnapshot.isDraggingOver}
          // isDropDisabled={props.isDropDisabled}
          // isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <div
            ref={dropProvided.innerRef}
            className={concatClassNames(
              styles.listWrapper,
              classNames?.itemListWrapper
            )}
          >
            {items.map((item: IDraggableBoardItem, index: number) => (
              <Draggable
                key={index}
                draggableId={item.id}
                index={index}
              >
                {(dragProvided) => (
                  <div
                    className={concatClassNames(
                      styles.itemWrapper,
                      classNames?.itemWrapper
                    )}
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    {item.label}
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {dropProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default memo(ItemList);
