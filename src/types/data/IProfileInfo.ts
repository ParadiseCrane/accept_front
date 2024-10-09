import { IUser } from './IUser';

export interface IMinimalProfileBundle {
  user: IUser;
}

export interface IBaseInfo {
  name: string;
  amount: number;
}

interface ITaskComplexity {
  title: string;
  start: number;
  end: number;
}

export interface IComplexityInfo extends ITaskComplexity {
  amount: number;
}

export interface IAttemptInfo {
  total: number;
  verdict_distribution: IBaseInfo[];
  language_distribution: IBaseInfo[];
  language_solved_distribution: IBaseInfo[];
}

export interface ITaskInfo {
  total_tried: number;
  total_solved: number;
  verdict_distribution: IBaseInfo[];
  complexity_distribution: IComplexityInfo[];
}

export interface IRatingInfo {
  place: number;
  score: number;
}

export interface IFullProfileBundle extends IMinimalProfileBundle {
  attempt_info: IAttemptInfo;
  task_info: ITaskInfo;
  rating_info?: IRatingInfo;
}
