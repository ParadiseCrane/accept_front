import { IAssessmentType, ITournamentStatus } from './atomic';
import { ITag } from './ITag';
import { ITaskDisplay } from './ITask';

export interface ITournamentDisplay {
  spec: string;
  author: string;
  title: string;

  tags: ITag[];

  status: ITournamentStatus;

  participantsNumber: number;
  start: Date;
  end: Date;
}

export interface ITournament
  extends Omit<ITournamentDisplay, 'participantsNumber'> {
  description: string;
  tasks: ITaskDisplay[];

  moderators: string[];
  participants: string[];
  allowRegistrationAfterStart: boolean;
  frozeResults: Date;
  banned: string[];
  pin: boolean;
}

export interface ITournamentListBundle {
  tournaments: ITournamentDisplay[];
  tags: ITag[];
  statuses: ITournamentStatus[];
}

export interface ITournamentAddBundle {
  assessmentTypes: IAssessmentType[];
  tags: ITag[];
}

export interface ITournamentEditBundle {
  tournament: ITournamentEdit;
  assessmentTypes: IAssessmentType[];
  tags: ITag[];
}

export interface ITournamentAdd
  extends Omit<
    ITournament,
    'tasks' | 'status' | 'tags' | 'participantsNumber' | 'banned'
  > {
  tasks: string[];
  tags: string[];
  status: number;

  participants: string[];

  moderators: string[];
  assessmentType: number;
  frozeResults: Date;

  shouldPenalizeAttempt: boolean;
}

export interface ITournamentEdit
  extends Omit<
    ITournamentAdd,
    'tasks' | 'assessmentType' | 'tags' | 'status'
  > {
  tasks: ITaskDisplay[];
  assessmentType: IAssessmentType;
  tags: ITag[];
  status: ITournamentStatus;
}

export interface IAssignmentTimeInfo {
  status: number;
  infinite: boolean;

  start: Date;
  end: Date;
}
