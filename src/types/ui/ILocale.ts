import en from '@locale/en';
import ru from '@locale/ru';

import { setter } from './atomic';

export const locales = {
  ru,
  en,
};

export interface ILocaleContext {
  locale: ILocale;
  lang: IAvailableLang;
  langList: IAvailableLang[];
  weekDays: string[];
  months: string[];
  set: setter<IAvailableLang>;
}

export type IAvailableLang = keyof typeof locales;

export type ILocale = typeof ru;
export const defaultLocaleName = 'ru';
