import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';

const url = env.API_ENDPOINT + '/api/logout';

export default async function signOut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).send('Success');
}
