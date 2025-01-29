import { analytics } from './analytics';
import { assignment } from './assignment';
import { assignmentSchema } from './assignmentSchema';
import { attempt } from './attempt';
import { auth } from './auth';
import { course } from './course';
import { executor } from './executor';
import { feedback } from './feedback';
import { group } from './group';
import { notification } from './notification';
import { profile } from './profile';
import { students } from './students';
import { task } from './task';
import { task_test } from './task_test';
import { team } from './team';
import { test_group } from './test_group';
import { tournament } from './tournament';
import { tournament_task } from './tournament_task';
import { user } from './user';

export const notify = {
  errors: {
    unauthorized: 'Unauthorized',
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
  students,
  user,
  feedback,
  executor,
  task_test,
  test_group,
  team,
  analytics,
  course,
};
