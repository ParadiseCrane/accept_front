import { LanguageFn } from 'lowlight';

export interface IProgrammingLanguage {
  nameAsString: string;
  name: string;
  nameAsFn: LanguageFn;
}
