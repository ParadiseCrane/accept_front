export interface IAttemptStatus {
  spec: number;
  name: string;
}

export interface IAssignmentStatus {
  spec: number;
  name: string;
}

export interface IVerdict {
  spec: number;
  fullText: string;
  shortText: string;
}
export interface ITaskTestData {
  inputData: string;
  outputData: string;
}

export interface ITaskTestData {
  inputData: string;
  outputData: string;
}

export interface ITestResult {
  test: string; //test spec
  verdict: IVerdict;
}

export interface ITestResultDisplay {
  test: number; //test spec
  verdict: IVerdict;
}

export interface ILanguage {
  spec: number;
  name: string;
  shortName: string;
  extensions: string[];
}
export interface ITaskCheckType {
  // "tests" or "checker"
  spec: number;
  name: string;
}
export interface ITaskType {
  // "code" or "text"
  spec: number;
  name: string;
}
export interface IAssessmentType {
  spec: number;
  name: string;
}
export interface ITournamentStatus {
  spec: number;
  name: string;
}

export interface IAssessmentType {
  spec: number;
  name: string;
}

export interface IRole {
  // User < Student < Teacher < Admin
  spec: number;
  name: string;
  accessLevel: number;
}

export interface IHintAlarmType {
  spec: number;
  name: string;
}

export interface IConstraints {
  time?: number;
  memory?: number;
}

export interface IFullTestResult {
  test: ITaskTestData;
  verdict: IVerdict;
}

export interface IPartialTestResult {
  test: number; // index
  verdict: IVerdict;
}

export interface IAnalyticsData {
  path: string;
  average: number;
  count: number;
  method: string;
}

export interface IAnalyticsResponse {
  documents: IAnalyticsData[];
  total: number;
}

export interface IActivityData {
  count: number;
  date: Date;
}

export type IActivity = 'assignment' | 'tournament';
