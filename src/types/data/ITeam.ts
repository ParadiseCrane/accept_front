import { IUserDisplay } from './IUser';
import { ITournamentBaseInfo } from './ITournament';

export interface ITeam {
  spec: string;
  name: string;
  origin: ITournamentBaseInfo;
  capitan: IUserDisplay;
  participants: IUserDisplay[];
  date: Date;
}

export interface ITeamDisplay {
  spec: string;
  name: string;
  capitan: IUserDisplay;
}
