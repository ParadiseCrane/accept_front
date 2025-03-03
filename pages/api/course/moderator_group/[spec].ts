import { ICourseModeratorGroup } from '@custom-types/data/ICourse';
import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

const data: ICourseModeratorGroup[] = [
  {
    moderator: {
      login: 'login 1',
      shortName: 'Moderator 1',
    },
    group: {
      spec: 'group spec 1',
      name: 'Group 1',
      readonly: false,
    },
  },
  {
    moderator: {
      login: 'login 2',
      shortName: 'Moderator 2',
    },
    group: {
      spec: 'group spec 2',
      name: 'Group 2',
      readonly: false,
    },
  },
  {
    moderator: {
      login: 'login 3',
      shortName: 'Moderator 3',
    },
    group: {
      spec: 'group spec 3',
      name: 'Group 3',
      readonly: false,
    },
  },
  {
    moderator: {
      login: 'login 4',
      shortName: 'Moderator 4',
    },
    group: {
      spec: 'group spec 4',
      name: 'Group 4',
      readonly: false,
    },
  },
];

export default async function CourseModeratorGroup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO заменить на реальные данные
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/course/participant/${req.query.spec}/${req.query.group}`,
  // });
  res.status(200).json(data);
}
