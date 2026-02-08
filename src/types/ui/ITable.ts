export interface ITableColumn {
  label: string;
  key: string;
  sortable: boolean;
  sorted: -1 | 0 | 1;
  allowMiddleState: boolean;
  sortFunction: (_a: any, _b: any) => -1 | 0 | 1;
  hidable: boolean;
  hidden: boolean;
  size: number;
  minWidth?: number;
}
