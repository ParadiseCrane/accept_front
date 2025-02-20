import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function CourseParticipants(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO заменить на реальные данные
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/course/participant/${req.query.spec}/${req.query.group}`,
  });
  // res.status(200).json([]);
  // res.status(200).json([
  //   {
  //     role: {
  //       spec: 12,
  //       name: 'role 1',
  //       accessLevel: 1,
  //     },
  //     login: 'login 1',
  //     shortName: 'shortname 1',
  //   },
  //   {
  //     role: {
  //       spec: 12,
  //       name: 'role 1',
  //       accessLevel: 1,
  //     },
  //     login: 'login 2',
  //     shortName: 'shortname 2',
  //   },
  //   {
  //     role: {
  //       spec: 12,
  //       name: 'role 1',
  //       accessLevel: 1,
  //     },
  //     login: 'login 3',
  //     shortName: 'shortname 3',
  //   },
  //   {
  //     role: {
  //       spec: 121,
  //       name: 'role 2',
  //       accessLevel: 2,
  //     },
  //     login: 'login 11',
  //     shortName: 'shortname 11',
  //   },
  //   {
  //     role: {
  //       spec: 121,
  //       name: 'role 2',
  //       accessLevel: 2,
  //     },
  //     login: 'login 21',
  //     shortName: 'shortname 21',
  //   },
  //   {
  //     role: {
  //       spec: 121,
  //       name: 'role 2',
  //       accessLevel: 2,
  //     },
  //     login: 'login 31',
  //     shortName: 'shortname 31',
  //   },
  // ]);
}
