import { serialize } from 'cookie';

export const createTokenCookie = (
  name: string,
  value: string,
  expires: any
) =>
  serialize(name, value, {
    expires,
    secure: process.env.NODE_ENV !== 'development',
    path: '/',
    sameSite: 'strict',
  });
