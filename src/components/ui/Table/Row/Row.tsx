import { FC, memo } from 'react';

const Row: FC<{
  keys: string[];
  row: any;
  classNames?: any;
  even: boolean;
  gridTemplate: object;
}> = ({ keys, row, classNames, even, gridTemplate }) => {
  return (
    <tr
      style={gridTemplate}
      className={even ? classNames.even : classNames.odd}
    >
      {keys.map((key, index) => (
        <td className={classNames[key] + ' ' + classNames.cell} key={index}>
          {row[key]
            ? typeof row[key] === 'object'
              ? row[key].display
              : row[key]
            : row[key] === 0
            ? 0
            : '-'}
        </td>
      ))}
    </tr>
  );
};

export default memo(Row);
