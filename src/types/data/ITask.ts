import {
  IAttemptStatus,
  IHintAlarmType,
  ILanguage,
  ITaskCheckType,
  ITaskTestData,
  ITaskType,
  IVerdict,
} from './atomic';
import { ITag } from './ITag';

export interface IHint {
  content: string;
  alarmType: IHintAlarmType; //  spec
  alarm: number;
  // depends on alarmType
  // "attempts" -> number of attempts required for hint to appear
  // "timestamp" -> timestamp when hint will appear
}

export interface IChecker {
  sourceCode: string;
  language: string; // spec
}

interface IConstraints {
  time: number;
  memory: number;
}

export interface Example {
  inputData: string;
  outputData: string;
}

export interface ITaskBaseInfo {
  spec: string;
  title: string;
}

export interface IBarTask {
  spec: string;
  status?: IAttemptStatus;
  verdict?: IVerdict;
}

export interface ITaskDisplay {
  spec: string;
  title: string;
  tags: ITag[];
  author: string;
  verdict: IVerdict;
  insertedDate: Date;
  complexity: number;
  status?: IAttemptStatus;
}

export interface ITaskDisplayWithPublic extends ITaskDisplay {
  public: boolean;
}

export interface ITask extends ITaskDisplay {
  description: string;
  constraints: IConstraints;

  examples: Example[];
  inputFormat: string;
  outputFormat: string;
  remark: string | undefined;

  hint: IHint | undefined;

  allowedLanguages: ILanguage[];
  forbiddenLanguages: ILanguage[];

  testsNumber: number;
  taskType: ITaskType;
  predefined: boolean;
}

export interface ITaskEdit extends ITask {
  tests: ITaskTestData[];
  checker: IChecker | undefined;
  checkType: ITaskCheckType | undefined;
}
