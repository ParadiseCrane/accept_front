import { IAssessmentType, ILanguage } from './atomic';
import { IGroup } from './IGroup';
import { ITag } from './ITag';
import { ITaskDisplay } from './ITask';
import { IUserBaseInfo } from './IUser';

export interface IBaseTreeUnit {
  spec: string;
  kind: 'course' | 'lesson' | 'unit';
  title: string;
  order: string;
}

export interface ITreeUnit extends IBaseTreeUnit {
  orderAsNumber: number;
  depth: number;
  index: number;
  parentSpec: string;
  visible: boolean;
  childrenVisible: boolean;
  isOpen: boolean;
}

export interface ICourseAddEdit {
  title: string;
  description: string;
  kind: 'course';
  image: string;
  children: IBaseTreeUnit[];
}

export interface IUnitAddEdit {
  title: string;
  description: string;
  kind: 'unit';
  children: IBaseTreeUnit[];
}

export interface ICourse {
  spec: string;
  title: string;
  description: string;
  kind: 'course';
  image: string;
  author: string;
  children: IBaseTreeUnit[];
}

export interface IUnit {
  spec: string;
  kind: 'unit';
  title: string;
  description: string;
  children: IBaseTreeUnit[];
}

export interface ILesson extends Omit<IUnit, 'kind'> {
  kind: 'lesson';
  tasks: ITaskDisplay[];
  allowedLanguages: ILanguage[];
  forbiddenLanguages: ILanguage[];
}

export interface ILessonEditBundle {
  lesson: ILesson;
  tags: ITag[];
  assessmentTypes: IAssessmentType[];
}

export interface ICourseListItem {
  author: string;
  spec: string;
  title: string;
  date: Date;
  dateFormatted: string;
  numOfModules: number;
}

export interface ICourseGroupPair {
  courseSpec: string;
  groupSpec: string;
}

export interface IModeratorGroupPair {
  moderator: IUserBaseInfo;
  group: IGroup;
}

export interface ICourseDashboardMain {
  title: string;
  description: string;
  image: string;
  invite?: string;
}

export interface IGroupOpenness {
  group: string;
  spec: string;
  opened: boolean;
}
