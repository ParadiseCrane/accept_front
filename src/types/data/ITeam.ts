import { IUserDisplay } from './IUser';

export interface ITeam {
  spec: string;
  name: string;
  capitan: IUserDisplay;
  participants: IUserDisplay[];
  date: Date;
}

export interface ITeamDisplay {
  spec: string;
  name: string;
  capitan: IUserDisplay;
}
