import { assignmentSchema } from './assignmentSchema';
import { assignment } from './assignment';
import { attempt } from './attempt';
import { task } from './task';
import { group } from './group';
import { auth } from './auth';
import { profile } from './profile';
import { notification } from './notification';
import { tournament } from './tournament';
import { tournament_task } from './tournament_task';

export const notify = {
  errors: {
    unauthorized: 'Вы не авторизованы',
  },
  assignmentSchema,
  assignment,
  attempt,
  task,
  group,
  auth,
  tournament,
  tournament_task,
  notification,
  profile,
};
