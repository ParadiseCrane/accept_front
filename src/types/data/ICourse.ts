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

export interface ICourseAdd {
  title: string;
  description: string;
  kind: 'course';
  image: string;
  children: IUnit[];
}

export interface ICourse {
  spec: string;
  kind: 'course' | 'unit' | 'lesson';
  title: string;
  description: string;
  image: string;
  children: ICourse[] | ITask[];
}

export interface IUnit {
  spec: string;
  kind: 'lesson' | 'unit';
  title: string;
  order: string;
}
