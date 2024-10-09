import { checkWrapper } from '@utils/checkAccess';

// TODO: SOmehow remove
export const accessLevels = {
  user: 1,
  student: 2,
  teacher: 3,
  admin: 50,
  developer: 100,
};

export const protectedRoutesInfo: {
  [key: string]: (
    _entity_spec: string | undefined,
    _headers: { Authorization: string } | undefined,
    _pathname: string,
    _searchParams?: URLSearchParams
  ) => Promise<string | boolean>;
} = {
  // TODO: Check rights
  '/tournament': checkWrapper('read', 'tournament'),
  '/tournament/add': checkWrapper('add', 'tournament'),
  '/tournament/edit': checkWrapper('write', 'tournament'),
  '/edu/assignment_schema/add': checkWrapper('add', 'assignment_schema'),
  '/edu/assignment_schema/edit': checkWrapper('write', 'assignment_schema'),
  '/edu/assignment_schema/list': checkWrapper('read_list', 'assignment_schema'),
  '/edu/assignment_schema': checkWrapper('read', 'assignment_schema'),
  '/edu/assignment': checkWrapper('read', 'assignment'),
  '/edu/assignment/add': checkWrapper('add', 'assignment'),
  '/edu/assignment/edit': checkWrapper('write', 'assignment'),
  '/group/add': checkWrapper('add', 'group'),
  '/group/edit': checkWrapper('write', 'assignment'),
  '/group/list': checkWrapper('read_list', 'group'),
  '/notification/add': checkWrapper('add', 'notification'),
  '/task/add': (_, headers, pathname, searchParams) => {
    const tournament_spec = searchParams?.get('tournament');
    if (!tournament_spec)
      return checkWrapper('add', 'task')(
        undefined,
        headers,
        pathname,
        searchParams
      );
    return checkWrapper('moderate', 'tournament')(
      tournament_spec,
      headers,
      pathname,
      searchParams
    );
  },
  '/user/list': checkWrapper('read_list', 'user'),
  '/task': checkWrapper('read', 'task'),
  '/task/edit': checkWrapper('write', 'task'),
  '/task/tests': checkWrapper('write', 'task'),
  '/dashboard/admin': checkWrapper('read', 'admin_dashboard'),
  '/dashboard/assignment': checkWrapper('moderate', 'assignment'),
  '/dashboard/developer': checkWrapper('read', 'developer_dashboard'),
  '/dashboard/tournament': checkWrapper('moderate', 'tournament'),
  '/attempt': checkWrapper('read', 'attempt'),
};
