import { ReactNode } from 'react';

import { callback, setter } from './atomic';

export interface IListMessage {
  spec: string;
  title: string;
  author: string;
  subject: string;
  message: string;
  date: Date;
}

export interface IListAction {
  icon: ReactNode;
  tooltipLabel: string;
  onClick: (_: string[], __: setter<string[]>) => void;
  disabled?: callback<string[], boolean>;
}
