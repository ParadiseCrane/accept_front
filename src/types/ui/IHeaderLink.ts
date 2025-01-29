import { accessLevels } from '@constants/protectedRoutes';
import { ReactNode } from 'react';

import { ILocale } from './ILocale';

export interface IHeaderLink {
  text: (_: ILocale) => string;
  type: 'dropdown' | 'regular';
  links?: IHeaderLink[];
  href: string;
  permission?: keyof typeof accessLevels;
}

export interface IProfileMenuLink {
  text: (_: ILocale) => string;
  href: string;
  icon: ReactNode;
  permission?: keyof typeof accessLevels;
}
