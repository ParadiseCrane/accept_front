export type callback<T = any, V = any> = (_: T) => V;
export type pureCallback<T = any> = () => T;

export type setter<T = callback> = (_: T) => void;

export interface Item {
  value: string;
  [key: string]: any;
}

export type IWidth =
  | '320'
  | '480'
  | '768'
  | '1024'
  | '1280'
  | '1440'
  | '1920';
