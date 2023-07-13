import { IUser } from './IUser';

export interface IMinimalProfileBndle {
  user: IUser;
}

export interface IBaseInfo {
  name: string;
  amount: number;
}

export interface IComplexity {
  start: number;
  end: number;
  amount: number;
}

export interface IAttemptInfo {
  total: number;
  verdict_distribution: IBaseInfo[];
  language_distribution: IBaseInfo[];
  language_solved_distribution: IBaseInfo[];
}

export interface ITaskInfo {
  total: number;
  verdict_distribution: IBaseInfo[];
  complexity_distribution: IComplexity[];
}

export interface IRatingInfo {
  place: number;
  score: number;
}

export interface IFullProfileBundle extends IMinimalProfileBndle {
  attempt_info: IAttemptInfo;
  task_info: ITaskInfo;
  rating_info: IRatingInfo;
}
