import { IUserDisplay } from './IUser';
import { ITournamentBaseInfo } from './ITournament';

export interface ITeamBaseInfo {
  spec: string;
  name: string;
}

export interface ITeam {
  spec: string;
  name: string;
  origin: ITournamentBaseInfo;
  capitan: IUserDisplay;
  participants: IUserDisplay[];
  date: Date;
}

export interface ITeamAdd {
  name: string;
  capitan: string;
  participants: string[];
}

export interface ITeamDisplay {
  spec: string;
  name: string;
  capitan: IUserDisplay;
}
