import { IVerdict } from './atomic';
import { ITaskBaseInfo } from './ITask';
import { ITeamDisplay } from './ITeam';

export interface IResult {
  attempt: string;
  date: Date;
  verdict: IVerdict;
  verdictTest: number;
  passedTests: number;
  percentTests: number;
  score: number;
}

export interface ITableResults {
  attempts: IResult[];
  best?: IResult;
}

export interface ITeamResult {
  team: ITeamDisplay;
  results: ITableResults[];
  score: number;
}

export interface IFullResults {
  tasks: ITaskBaseInfo[];
  user_results: ITeamResult[];
}
