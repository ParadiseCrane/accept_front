import {
  checkRead,
  checkTestRights,
  checkWrite,
} from '@utils/checkAccess';

export const accessLevels = {
  user: 1,
  student: 2,
  teacher: 3,
  admin: 50,
  developer: 100,
};

export const protectedRoutesInfo: {
  [key: string]: (
    _target: string,
    _headers: { Cookie: string } | undefined,
    _pathname: string,
    _searchParams?: URLSearchParams
  ) => Promise<string | boolean>;
} = {
  '/dashboard/assignment': checkWrite,
  '/dashboard/tournament': checkWrite,
  '/tournament': checkRead,
  '/tournament/add': (_, headers, pathname, searchParams) =>
    checkWrite('tournament_add', headers, pathname, searchParams),
  '/tournament/edit': checkWrite,
  '/edu/assignment_schema/add': (
    _,
    headers,
    pathname,
    searchParams
  ) =>
    checkWrite(
      'assignment_schema_add',
      headers,
      pathname,
      searchParams
    ),
  '/edu/assignment_schema/edit': checkWrite,
  '/edu/assignment_schema/list': (
    _,
    headers,
    pathname,
    searchParams
  ) =>
    checkRead(
      'assignment_schema_list',
      headers,
      pathname,
      searchParams
    ),
  '/edu/assignment_schema': checkRead,
  '/edu/assignment': checkRead,
  '/edu/assignment/add': (_, headers, pathname, searchParams) =>
    checkWrite('assignment_add', headers, pathname, searchParams),
  '/edu/assignment/edit': checkWrite,
  '/group/add': (_, headers, pathname, searchParams) =>
    checkWrite('group_modification', headers, pathname, searchParams),
  '/group/edit': (_, headers, pathname, searchParams) =>
    checkWrite('group_modification', headers, pathname, searchParams),
  '/notification/add': (_, headers, pathname, searchParams) =>
    checkWrite('notification_add', headers, pathname, searchParams),
  '/task/add': (_, headers, pathname, searchParams) => {
    const tournament_spec = searchParams?.get('tournament');
    if (!tournament_spec)
      return checkWrite('task_add', headers, pathname, searchParams);

    return checkWrite(
      tournament_spec,
      headers,
      pathname,
      searchParams
    );
  },
  '/task': checkRead,
  '/task/edit': checkWrite,
  '/task/tests': checkTestRights,
  '/user/list': (_, headers, pathname, searchParams) =>
    checkRead('user_list', headers, pathname, searchParams),
  '/group/list': (_, headers, pathname, searchParams) =>
    checkRead('group_list', headers, pathname, searchParams),
  '/dashboard/admin': (_, headers, pathname, searchParams) =>
    checkRead('admin_dashboard', headers, pathname, searchParams),
  '/dashboard/developer': (_, headers, pathname, searchParams) =>
    checkRead('developer_dashboard', headers, pathname, searchParams),
  '/attempt': checkRead,
};
