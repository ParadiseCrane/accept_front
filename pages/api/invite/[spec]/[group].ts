import { IGroupInvite } from '@custom-types/data/IGroup';
import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';

const data: IGroupInvite[] = [
  {
    invite_spec: '123',
    group: {
      spec: '111',
      name: 'Group 1',
      readonly: false,
    },
  },
  {
    invite_spec: '1234',
    group: {
      spec: '222',
      name: 'Group 2',
      readonly: false,
    },
  },
  {
    invite_spec: '12345',
    group: {
      spec: '333',
      name: 'Group 3',
      readonly: false,
    },
  },
  {
    invite_spec: '123456',
    group: {
      spec: '444',
      name: 'Group 4',
      readonly: false,
    },
  },
];

const getData = (group: string) => {
  if (group === 'all') {
    return data;
  } else {
    return v4().toString();
  }
};

export default async function InviteCourseGroup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO заменить на реальные данные
  // await fetchWrapper({
  //   req: req,
  //   res: res,
  //   url: `api/invite/${req.query.spec}/${req.query.group}`,
  // });
  // res.status(200).json([]);
  res.status(200).json(getData(req.query.group!.toString()));
}
