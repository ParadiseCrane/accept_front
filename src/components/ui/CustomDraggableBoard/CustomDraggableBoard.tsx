import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DragDropContext,
  DropResult,
  Droppable,
  DroppableProps,
} from 'react-beautiful-dnd';
import { callback } from '@custom-types/ui/atomic';
import {
  CustomDraggableBoardClassNames,
  IDraggableBoardColumn,
} from '@custom-types/ui/IDraggableBoard';
import BoardColumn from './BoardColumn/BoardColumn';
import { reorderList } from '@utils/reorderList';
import styles from './customDraggableBoard.module.css';
import { reorderColumns } from '@utils/reorderCustomBoard';
import { concatClassNames } from '@utils/concatClassNames';

const CustomDraggableBoard: FC<{
  columns: IDraggableBoardColumn[];
  setColumns: callback<
    (_: IDraggableBoardColumn[]) => IDraggableBoardColumn[],
    void
  >;
  droppableProps?: DroppableProps;
  horizontal?: boolean;
  classNames?: CustomDraggableBoardClassNames;
}> = ({
  columns,
  setColumns,
  droppableProps,
  horizontal,
  classNames,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      // dropped nowhere
      if (!result.destination) {
        return;
      }

      const source = result.source;
      const destination = result.destination;

      // did not move anywhere
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      // reordering column
      if (result.type === 'COLUMN') {
        setColumns((columns) =>
          reorderList<IDraggableBoardColumn>(
            columns,
            source.index,
            destination.index
          )
        );

        return;
      }

      setColumns((columns) => {
        let reordered_column = reorderColumns({
          columns,
          source,
          destination,
        });
        return reordered_column;
      });
    },
    [setColumns]
  );

  const wrapperHash = useMemo(
    () =>
      columns
        .map((column) => column.values.map((item) => item.id).join())
        .join('|'),
    [columns]
  );

  return (
    <div
      className={concatClassNames(
        classNames?.wrapper,
        styles.wrapper
      )}
      key={wrapperHash}
    >
      {mounted && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            type="COLUMN"
            droppableId="board"
            direction={horizontal ? 'horizontal' : 'vertical'}
            {...droppableProps}
          >
            {(provided) => (
              <div
                style={{
                  flexDirection: horizontal ? 'row' : 'column',
                }}
                className={concatClassNames(
                  styles.columnsWrapper,
                  classNames?.columnsWrapper
                )}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {columns.map(
                  (item: IDraggableBoardColumn, index: number) => (
                    <BoardColumn
                      key={index}
                      id={item.id}
                      columnIndex={index}
                      label={item.columnLabel}
                      items={item.values}
                      classNames={classNames}
                    />
                  )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default memo(CustomDraggableBoard);
