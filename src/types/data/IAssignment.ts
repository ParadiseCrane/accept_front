import {
  IAssignmentSchema,
  IAssignmentSchemaDisplay,
} from './IAssignmentSchema';
import { IAssignmentStatus } from './atomic';
import { IGroup } from './IGroup';

export interface IAssignment extends IAssignmentSchema {
  starter: string;
  status: IAssignmentStatus;
  infinite: boolean;

  start?: Date;
  end?: Date;

  groups: IGroup[];
}

export interface IAssignmentAddBundle {
  assignment_schemas: IAssignmentSchemaDisplay[];
  groups: IGroup[];
}

export interface IAssignmentEditBundle {
  assignment_schemas: IAssignmentSchemaDisplay[];
  groups: IGroup[];
  assignment: IAssignment;
}
