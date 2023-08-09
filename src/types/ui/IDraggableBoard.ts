import { ReactNode } from 'react';

export interface IDraggableBoardItem {
  id: string;
  label: ReactNode;
}

export interface IDraggableBoardColumn {
  id: string;
  columnLabel: ReactNode;
  values: IDraggableBoardItem[];
}

export interface CustomDraggableBoardClassNames {
  wrapper?: any;
  columnsWrapper?: any;
  columnWrapper?: any;
  columnWrapperDragging?: any;
  columnLabelWrapper?: any;
  columnLabelDragging?: any;
  itemListWrapper?: any;
  itemWrapper?: any;
}
