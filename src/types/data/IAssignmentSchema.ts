import { ITag } from './ITag';
import { ITaskDisplay } from './ITask';

export interface IAssignmentSchema {
  spec: string;
  title: string;
  author: string;
  description: string;
  tasks: ITaskDisplay[];
  tags: ITag[];
}

export interface IAssignmentSchemaDisplay {
  spec: string;
  title: string;
  author: string;
  taskNumber: number;
  tags: ITag[];
}

export interface IAssignmentSchemaListBundle {
  assignment_schemas: IAssignmentSchemaDisplay[];
  tags: ITag[];
}

export interface IAssignmentSchemaEditBundle {
  assignment_schema: IAssignmentSchema;
  tags: ITag[];
}
