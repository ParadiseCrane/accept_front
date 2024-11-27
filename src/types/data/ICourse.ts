import { ITask } from './ITask';

export interface ICourse {
  spec: string;
  title: string;
  description: string;
  image: string;
  children: ICourse[] | ITask[];
}

export interface ICourseAdd {
  spec: string;
  title: string;
  description: string;
  image: string;
  children: IUnit[];
}

export interface IUnit {
  kind: 'lesson' | 'unit';
  id: string;
  title: string;
  units: IUnit[];
}
