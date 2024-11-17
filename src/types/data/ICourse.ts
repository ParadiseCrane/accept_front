import { ITask } from './ITask';

export interface ICourse {
  spec: string;
  title: string;
  description: string;
  image: string;
  children: ICourse[] | ITask[];
}
