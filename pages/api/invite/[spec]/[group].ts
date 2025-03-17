import { IGroupInvite } from '@custom-types/data/IGroup';
import { fetchWrapper } from '@utils/fetchWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';

const data: IGroupInvite[] = [
  {
    invite_spec: v4(),
    group: {
      spec: v4(),
      name: 'Group 1',
      readonly: false,
    },
  },
  {
    invite_spec: v4(),
    group: {
      spec: v4(),
      name: 'Group 2',
      readonly: false,
    },
  },
  {
    invite_spec: v4(),
    group: {
      spec: v4(),
      name: 'Group 3',
      readonly: false,
    },
  },
  {
    invite_spec: v4(),
    group: {
      spec: v4(),
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
  res.status(200).json(getData(req.query.group!.toString()));
  // if (req.method == 'GET') {
  //   await fetchWrapper({
  //     req: req,
  //     res: res,
  //     url: `api/invite/${req.query.spec}/${req.query.group}`,
  //     method: 'GET',
  //   });
  // } else {
  //   await fetchWrapper({
  //     req: req,
  //     res: res,
  //     url: `api/invite/${req.query.spec}/${req.query.group}`,
  //     method: 'POST',
  //   });
  // }
}
