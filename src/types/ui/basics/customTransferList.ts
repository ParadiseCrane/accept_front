import { ReactNode } from 'react';
import { callback, pureCallback } from '../atomic';

export interface Item {
  label: string;
  [key: string]: any;
}

export interface ICustomTransferListItem extends Item {
  sortValue: any;
}

export type ICustomTransferListData =
  | [ICustomTransferListItem[], ICustomTransferListItem[]]
  | undefined;

export interface ICustomTransferListItemComponentProps {
  item: Item;
  onClick: pureCallback<void>;
  index: number;
}

export type ICustomTransferListItemComponent = callback<
  ICustomTransferListItemComponentProps,
  ReactNode
>;
