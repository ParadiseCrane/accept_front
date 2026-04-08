import { IResponseErrorObject } from "@custom-types/data/atomic";
import { checkWrapper } from "@utils/checkAccess";

// TODO: Somehow remove
export const accessLevels = {
  anyone: 0,
  user: 1,
  student: 2,
  teacher: 3,
  admin: 50,
  developer: 100,
};

export const protectedRoutesInfo: {
  [key: string]: (
    _entity_spec: string | undefined,
    _access_token: string | undefined,
    _pathname: string,
    _searchParams?: URLSearchParams,
  ) => Promise<string | boolean | IResponseErrorObject>;
} = {
  // TODO: Check rights, rework checkWrapper allowed logic
  // "/tournament": checkWrapper("read", "tournament", accessLevels["anyone"]),
  "/tournament/add": checkWrapper(
    "add",
    "tournament",
    accessLevels["teacher"],
    true,
  ),
  "/tournament/edit": checkWrapper(
    "write",
    "tournament",
    accessLevels["teacher"],
    false,
    true,
  ),
  "/assignment_schema/add": checkWrapper(
    "add",
    "assignment_schema",
    accessLevels["teacher"],
    true,
  ),
  "/assignment_schema/edit": checkWrapper(
    "write",
    "assignment_schema",
    accessLevels["teacher"],
  ),
  "/assignment_schema/list": checkWrapper(
    "read_list",
    "assignment_schema",
    accessLevels["teacher"],
    true,
  ),
  "/assignment_schema": checkWrapper(
    "read",
    "assignment_schema",
    accessLevels["teacher"],
    true,
  ),
  "/assignment": checkWrapper("read", "assignment", accessLevels["teacher"]),
  "/assignment/add": checkWrapper(
    "add",
    "assignment",
    accessLevels["teacher"],
    true,
  ),
  "/assignment/edit": checkWrapper(
    "write",
    "assignment",
    accessLevels["teacher"],
  ),
  "/organization/add": checkWrapper(
    "moderate",
    "organization",
    accessLevels["developer"],
    true,
  ),
  "/organization/edit": checkWrapper(
    "moderate",
    "organization",
    accessLevels["admin"],
    true,
  ),
  "/group/add": checkWrapper("add", "group", accessLevels["teacher"], true),
  "/group/edit": checkWrapper(
    "write",
    "assignment",
    accessLevels["teacher"],
    true,
  ),
  "/group/list": checkWrapper(
    "read_list",
    "group",
    accessLevels["teacher"],
    true,
  ),
  "/notification/add": checkWrapper(
    "add",
    "notification",
    accessLevels["teacher"], // Is it true??
  ),
  "/task/add": (_, access_token, pathname, searchParams) => {
    const tournament_spec = searchParams?.get("tournament");
    if (!tournament_spec)
      return checkWrapper("add", "task", accessLevels["teacher"], true)(
        undefined,
        access_token,
        pathname,
        searchParams,
      );
    return checkWrapper("moderate", "tournament", accessLevels["admin"])(
      tournament_spec,
      access_token,
      pathname,
      searchParams,
    );
  },
  "/user/list": checkWrapper(
    "read_list",
    "user",
    accessLevels["teacher"],
    true,
  ),
  "/task": checkWrapper("read", "task", accessLevels["admin"]),
  "/task/edit": checkWrapper("write", "task", accessLevels["admin"]),
  "/task/tests": checkWrapper("read_tests", "task", accessLevels["admin"]),
  "/dashboard/admin": checkWrapper(
    "read",
    "admin_dashboard",
    accessLevels["admin"],
  ),
  "/dashboard/assignment": checkWrapper(
    "moderate",
    "assignment",
    accessLevels["teacher"],
    true,
  ),
  "/dashboard/developer": checkWrapper(
    "read",
    "developer_dashboard",
    accessLevels["developer"],
    true,
  ),
  "/dashboard/tournament": checkWrapper(
    "moderate",
    "tournament",
    accessLevels["admin"],
  ),
  "/attempt": checkWrapper("read", "attempt", accessLevels["teacher"]),
  "/rating": checkWrapper("read", "user", accessLevels["user"]),
};
