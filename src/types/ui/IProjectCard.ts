import { ILocale } from "./ILocale";

export interface IProjectCard {
  title: (_locale: ILocale) => string;
  description: (_locale: ILocale) => string;
  image: string;
  href: string;
  eventName?: string;
}
