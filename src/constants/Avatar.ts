import { PREDEFINED_COLORS } from './Colors';

const AVATAR_VARIANT = 'bottts-neutral';
const PARAMS: { [key: string]: string[] } = {
  eyes: [
    'bulging',
    'eva',
    'frame1',
    'frame2',
    'happy',
    'hearts',
    'robocop',
    'roundFrame01',
    'roundFrame02',
    'shade01',
  ],
  backgroundType: ['gradientLinear', 'solid'],
  backgroundColor: PREDEFINED_COLORS.map((item) =>
    item.slice(1).toLowerCase()
  ),
};

const VARIABLE_PARAMS: {
  [key: string]: { min: number; max: number };
} = {
  translateX: {
    min: -10,
    max: 10,
  },
  translateY: {
    min: -5,
    max: 5,
  },
};

const generate_hash = (login: string, min: number, max: number) => {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash += login.charCodeAt(i);
  }

  return (hash % (max - min)) - (max - min) / 2;
};

const generate_params_string = (login: string): string => {
  let result = `seed=${login}&`;
  result += Object.entries(PARAMS)
    .map(([key, value]) => `${key}=${value.join(',')}`)
    .join('&');
  result += '&';
  result += Object.entries(VARIABLE_PARAMS)
    .map(
      ([key, value]) =>
        `${key}=${generate_hash(login, value.min, value.max)}`
    )
    .join('&');
  return result;
};

export const link = (login: string) =>
  `https://api.dicebear.com/7.x/${AVATAR_VARIANT}/svg?${generate_params_string(
    login
  )}`;
