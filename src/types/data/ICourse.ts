import { ITask } from './ITask';

export interface ICourseResponse {
  title: string;
  description: string;
  kind: 'course' | 'unit' | 'lesson';
  image: string;
  children: ICourseUnit[];
}

export interface ICourseUnit {
  spec: string;
  kind: 'course' | 'unit' | 'lesson';
  title: string;
  order: string;
}

export interface ITreeUnit {
  // id элемента
  spec: string;
  kind: 'course' | 'unit' | 'lesson';
  title: string;
  order: string;
  // порядок в виде числа для сортировки
  orderAsNumber: number;
  // глубина элемента
  depth: number;
  // порядок элемента
  index: number;
  // значение id родителя
  parentSpec: string;
  // значение видимости элемента
  visible: boolean;
  // значение видимости дочерних элементов
  childrenVisible: boolean;
}

export interface ICourseAdd {
  spec: string;
  title: string;
  description: string;
  image: string;
  children: IUnit[];
}

export interface ICourse {
  kind: 'course' | 'unit' | 'lesson';
  spec: string;
  title: string;
  description: string;
  image: string;
  children: ICourse[] | ITask[];
}

export interface IUnit {
  kind: 'lesson' | 'unit';
  id: string;
  title: string;
  units: IUnit[];
}
