import { pureCallback } from '../ui/atomic';
import { IRole } from './atomic';
import { IGroup } from './IGroup';
import { ITeamBaseInfo } from './ITeam';

export interface Role {
  spec: number;
  name: string;
  accessLevel: number;
}

export interface IWhoAmIResponse {
  current_user: IUserDisplay;
  users: IUserOrganization[];
}

export interface IUserOrganization {
  user: string;
  organization: string;
}

export interface IUser {
  login: string;
  name: string;
  surname: string;
  patronymic: string;
  email: string | undefined;
  shortName: string;
  groups: IGroup[];
  role: Role;
}

export interface IUserContext {
  authorized: boolean;
  user: IUserDisplay | undefined | null;
  accounts: IUserOrganization[];
  accessLevel: number;
  isUser: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  signIn: (_: string, __: string, ___: string) => Promise<Boolean>;
  signOut: pureCallback<Promise<Boolean>>;
  refresh: pureCallback<Promise<void>>;
  refreshAccess: pureCallback<number>;
}

export interface IRegUser {
  login: string;
  name: string;
  surname: string;
  patronymic: string;
  password: string;
  email: string | null;
}

export interface IUserListBundle {
  users: IUser[];
  groups: IGroup[];
  roles: IRole[];
}

export interface IUserDisplay {
  login: string;
  role: IRole;
  shortName: string;
}

export interface IParticipant extends IUserDisplay {
  banned?: boolean;
  banReason?: string;
  groups: IGroup[];
  team?: ITeamBaseInfo;
}

export interface IParticipantListBundle {
  users: IParticipant[];
  groups: IGroup[];
  roles: IRole[];
}
