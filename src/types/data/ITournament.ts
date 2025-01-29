import { IAssessmentType, ITournamentStatus } from './atomic';
import { ITag } from './ITag';
import { ITaskDisplay, ITaskDisplayWithPublic } from './ITask';

export interface ISecurity {
  spec: number;
  name: 'tournament' | 'basic';
}

export interface ITournamentDisplay {
  spec: string;
  organization: string;
  author: string;
  title: string;

  tags: ITag[];

  status: ITournamentStatus;

  teamsNumber: number;
  maxTeamSize: number;
  start: Date;
  end: Date;
}

export interface ITournamentBaseInfo {
  spec: string;
  title: string;
  status: ITournamentStatus;
}

export interface ITournament extends Omit<ITournamentDisplay, 'teamsNumber'> {
  description: string;
  tasks: ITaskDisplay[];

  moderators: string[];
  allowRegistrationAfterStart: boolean;
  frozeResults: Date;
  banned: string[];
  security: number;
}

export interface ITournamentListBundle {
  tournaments: ITournamentDisplay[];
  tags: ITag[];
  statuses: ITournamentStatus[];
}

export interface ITournamentAddBundle {
  assessmentTypes: IAssessmentType[];
  tags: ITag[];
  securities: ISecurity[];
}

export interface ITournamentEditBundle {
  tournament: ITournamentAdd;
  assessmentTypes: IAssessmentType[];
  tags: ITag[];
  securities: ISecurity[];
}

export interface ITournamentAdd
  extends Omit<
    ITournament,
    'tasks' | 'status' | 'tags' | 'teamsNumber' | 'banned'
  > {
  public: boolean;
  tasks: string[];
  tags: string[];
  status: number;

  moderators: string[];
  assessmentType: number;
  frozeResults: Date;

  shouldPenalizeAttempt: boolean;
}

export interface ITournamentEdit
  extends Omit<ITournamentAdd, 'tasks' | 'assessmentType' | 'tags' | 'status'> {
  tasks: ITaskDisplay[];
  assessmentType: IAssessmentType;
  tags: ITag[];
  status: ITournamentStatus;
}

export interface ITournamentResponse {
  tournament: ITournament;
  is_participant: boolean;
}

export interface ITournamentRegisterPayload {
  pin: string | undefined;
  team_name: string | undefined;
}

export interface ITournamentSettingsBundle {
  tasks: ITaskDisplayWithPublic[];
  allowRegistrationAfterStart: boolean;
}
