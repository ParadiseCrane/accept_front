export const concatClassNames: (
  ..._: (string | undefined)[]
) => string = (...classNames) =>
  classNames.filter((item) => !!item).join(' ');
