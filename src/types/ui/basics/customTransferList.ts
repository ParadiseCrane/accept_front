import { ReactNode } from 'react';
import { Item, callback, pureCallback } from '../atomic';

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
