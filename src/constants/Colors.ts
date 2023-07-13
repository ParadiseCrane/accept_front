const predefinedColors = [
  '#CC5DE8',
  '#845EF7',
  '#5C7CFA',
  '#339AF0',
  '#22B8CF',
  '#20C997',
  '#51CF66',
  '#94D82D',
  '#FCC419',
  '#FF922B',
  '#FF6B6B',
  '#F06595',
  '#43E67F',
];

export const getColor = (idx: number, offset?: number) => {
  return predefinedColors[
    (idx + (offset || 0)) % predefinedColors.length
  ];
};
