export type IRulesAction =
  | 'read'
  | 'write' // edit + delete
  | 'edit' // only for user (for now)
  | 'delete'
  | 'add'
  | 'ban'
  | 'read_list'
  | 'read_all'
  | 'moderate'
  | 'to_assignment'
  | 'read_tasks'
  | 'read_tests';

export type IRulesEntity =
  | 'task'
  | 'assignment'
  | 'attempt'
  | 'assignment_schema'
  | 'tournament'
  | 'user'
  | 'group'
  | 'team'
  | 'analytics'
  | 'notification'
  | 'feedback'
  | 'assignment_tag'
  | 'task_tag'
  | 'tournament_tag'
  | 'all_assignment'
  | 'current_attempt'
  | 'all_attempt'
  | 'student'
  | 'executor'
  | 'image'
  | 'organization'
  | 'developer'
  | 'developer_dashboard'
  | 'admin_dashboard'
  | 'course';

export interface IRightsPayload {
  action: IRulesAction;
  entity_spec?: string;
  entity?: IRulesEntity;
}
