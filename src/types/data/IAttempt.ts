import {
  IAttemptStatus,
  IConstraints,
  ILanguage,
  ITestResult,
  ITestResultDisplay,
} from './atomic';
import { ITaskBaseInfo } from './ITask';
import { IUserDisplay } from './IUser';

export interface IAttemptDisplay {
  spec: string;
  language: ILanguage;
  status: IAttemptStatus;
  date: Date;
  verdict?: ITestResultDisplay;
  task: ITaskBaseInfo;
  author: string;
  ai_generated?: number;
  is_ai_generated?: boolean;
}

export interface IBanInfo {
  reason: string;
  requester: string;
  date: Date;
}

export interface IAttempt {
  spec: string;
  language: ILanguage;
  status: IAttemptStatus;
  constraints?: IConstraints;
  programText: string;
  textAnswers: string[];
  date: Date;
  results: ITestResult[];
  verdict: ITestResultDisplay;
  task: ITaskBaseInfo;
  author: IUserDisplay;
  banInfo?: IBanInfo;
  ai_generated?: number;
  is_ai_generated?: boolean;
}
