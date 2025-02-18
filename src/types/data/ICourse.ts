import { ITask } from './ITask';

export interface ICourseResponse {
  title: string;
  description: string;
  kind: 'course' | 'unit' | 'lesson';
  image: string;
  children: IUnit[];
}

export interface ITreeUnit {
  spec: string;
  kind: 'course' | 'unit' | 'lesson';
  title: string;
  order: string;
  orderAsNumber: number;
  depth: number;
  index: number;
  parentSpec: string;
  visible: boolean;
  childrenVisible: boolean;
}

export interface ICourseAddEdit {
  title: string;
  description: string;
  kind: 'course' | 'unit';
  image: string;
  children: IUnit[];
}

export interface ICourseModel {
  spec: string;
  title: string;
  description: string;
  kind: 'course';
  image: string;
  // TODO убрать начальное значение
  author: 'Иван Иванов';
  children: IUnit[];
}

export interface ICourse {
  spec: string;
  kind: 'course' | 'unit' | 'lesson';
  title: string;
  description: string;
  // image только для course
  image: string;
  children: ICourse[] | ITask[];
}

export interface IUnit {
  spec: string;
  kind: 'course' | 'lesson' | 'unit';
  title: string;
  order: string;
}

export interface ICourseDisplay {
  spec: string;
  title: string;
  readonly: boolean;
}

export interface ICourseListItem {
  author: string;
  spec: string;
  title: string;
}

export interface ICourseGroupPair {
  courseSpec: string;
  groupSpec: string;
}
