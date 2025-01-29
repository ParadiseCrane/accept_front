import { IAssignmentStatus } from './atomic';
import {
  IAssignmentSchema,
  IAssignmentSchemaDisplay,
} from './IAssignmentSchema';
import { IAttemptDisplay } from './IAttempt';
import { IGroup } from './IGroup';
import { ITag } from './ITag';
export interface IAssignment extends IAssignmentSchema {
  origin: string;
  starter: string;
  status: IAssignmentStatus;
  infinite: boolean;

  start: Date;
  end: Date;

  groups: IGroup[];
}

export interface IAssignmentAdd {
  spec: string;
  origin: string;
  starter: string;
  status: number;
  infinite: boolean;

  start: Date;
  end: Date;

  groups: string[];
}
export interface IAssignmentAddBundle {
  assignment_schemas: IAssignmentSchemaDisplay[];
  groups: IGroup[];
}

export interface IAssignmentEditBundle {
  assignment_schemas: IAssignmentSchemaDisplay[];
  groups: IGroup[];
  assignment: IAssignmentAdd;
}

export interface IAssignmentResults {
  assignment: IAssignment;
  tasks: { spec: string; title: string }[];
  users: { login: string; shortName: string }[];
  results: {
    best: IAttemptDisplay | null;
    attempts: IAttemptDisplay[];
  }[][];
}

export interface IAssignmentDisplay {
  spec: string;
  title: string;
  author: string;
  taskNumber: number;
  tags: ITag[];
  starter: string;
  origin: string;
  groups: IGroup[];

  status: IAssignmentStatus;
  infinite: boolean;

  start: Date;
  end: Date;
}

export interface IAssignmentListBundle {
  assignments: IAssignmentDisplay[];
  tags: ITag[];
  groups: IGroup[];
}

export interface IAssignmentTimeInfo {
  status: number;
  infinite: boolean;

  start: Date;
  end: Date;
}
