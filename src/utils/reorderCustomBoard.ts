import { IDraggableBoardColumn } from '@custom-types/ui/IDraggableBoard';
import { callback } from '@custom-types/ui/atomic';
import { DraggableLocation } from 'react-beautiful-dnd';
import { reorderList } from './reorderList';

export const reorderColumns: callback<
  {
    columns: IDraggableBoardColumn[];
    source: DraggableLocation;
    destination: DraggableLocation;
  },
  IDraggableBoardColumn[]
> = ({ columns, source, destination }) => {
  const currentId = source.droppableId;
  const currentColumn = columns.find((item) => item.id == currentId);
  let currentColumnIndex = columns.findIndex(
    (item) => item.id == currentId
  );

  const destinationId = destination.droppableId;
  const destinationColumn = columns.find(
    (item) => item.id == destinationId
  );
  let destinationColumnIndex = columns.findIndex(
    (item) => item.id == destinationId
  );

  if (!destinationColumn || !currentColumn) return [...columns];
  const targetItem = currentColumn.values[source.index];

  // moving to same list
  if (currentId === destinationId) {
    const reorderedColumnItems = reorderList(
      currentColumn.values,
      source.index,
      destination.index
    );
    let result = [...columns];

    result[currentColumnIndex].values = reorderedColumnItems;
    return result;
  }

  // moving to different list
  currentColumn.values.splice(source.index, 1);
  destinationColumn.values.splice(destination.index, 0, targetItem);

  let result = [...columns];
  result[currentColumnIndex].values = currentColumn.values;
  result[destinationColumnIndex].values = destinationColumn.values;
  return result;
};
