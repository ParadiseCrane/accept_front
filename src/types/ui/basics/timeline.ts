import { TimelineItemProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface MyTimelineItemProps
  extends Omit<TimelineItemProps, 'content'> {
  content: ReactNode;
  date: string;
}

export type HistoryItemType = 'new' | 'bugfix' | 'update' | 'style' | 'soon';

export type HistoryItemVersion = 1 | 2;

export interface HistoryItem extends MyTimelineItemProps {
  title: string;
  content: string;
  date: string;
  type: HistoryItemType;
  version: HistoryItemVersion;
}
