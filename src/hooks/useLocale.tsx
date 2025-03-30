import {
  IAvailableLang,
  ILocale,
  ILocaleContext,
  locales,
} from '@custom-types/ui/ILocale';
import { useLocalStorage } from '@mantine/hooks';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

const langList = Object.keys(locales) as IAvailableLang[];

const LocaleContext = createContext<ILocaleContext>(null!);

const defaultLang = 'ru';

function getWeekDays(locale: ILocale) {
  return [
    locale.date.sunday,
    locale.date.monday,
    locale.date.tuesday,
    locale.date.wednesday,
    locale.date.thursday,
    locale.date.friday,
    locale.date.saturday,
  ];
}

function getMonths(locale: ILocale) {
  return [
    locale.months.january,
    locale.months.february,
    locale.months.march,
    locale.months.april,
    locale.months.may,
    locale.months.june,
    locale.months.july,
    locale.months.august,
    locale.months.september,
    locale.months.october,
    locale.months.november,
    locale.months.december,
  ];
}

export const LocaleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useLocalStorage<IAvailableLang>({
    key: 'accept_locale',
    defaultValue: defaultLang,
  });
  const set = useCallback(
    (lang: IAvailableLang) => {
      setLang(lang);
    },
    [setLang]
  );

  const value = useMemo<ILocaleContext>(
    () => ({
      locale: locales[lang as IAvailableLang],
      set,
      lang: lang as IAvailableLang,
      langList,
      weekDays: getWeekDays(locales[lang as IAvailableLang]),
      months: getMonths(locales[lang as IAvailableLang]),
    }),
    [lang, set]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale() {
  return useContext(LocaleContext);
}
