import { ITournamentBaseInfo } from './ITournament';
import { IUserDisplay } from './IUser';

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
  size: number;
}

export interface ITeamDisplayWithBanned extends ITeamDisplay {
  banned: boolean;
}
