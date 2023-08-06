import { ReactNode } from 'react';

export interface IDraggableBoardItem {
  id: string;
  label: ReactNode;
  [key: string]: any;
}

export interface IDraggableBoardColumn {
  columnLabel: ReactNode;
  values: IDraggableBoardItem[];
  [key: string]: any;
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
