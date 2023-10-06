import { FC, ReactNode, memo } from 'react';
import styles from './resultsTable.module.css';
import DropdownList from './DropdownList/DropdownList';
import { setter } from '@custom-types/ui/atomic';
import { Icon } from '@ui/basics';
import { RefreshDot } from 'tabler-icons-react';

export type ILabel = ReactNode;

export interface IData {
  best: ILabel;
  rest?: () => Promise<ILabel[]>;
}

const ResultsTable: FC<{
  columns: ILabel[];
  fixedRightColumns?: ILabel[];
  rows: ILabel[];
  data: IData[][];
  refetch: setter<boolean>;
}> = ({ columns, fixedRightColumns, rows, data, refetch }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.wrapperTable}>
        <tr>
          <td>
            <table className={styles.leftTable}>
              <thead>
                <tr>
                  <th>
                    <Icon size="sm" onClick={() => refetch(true)}>
                      <RefreshDot color="var(--secondary)" />
                    </Icon>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td className={styles.rowHeader}>{row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          <td>
            <table className={styles.middleTable}>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {data[index]
                      .slice(
                        0,
                        fixedRightColumns
                          ? -fixedRightColumns.length
                          : undefined
                      )
                      .map((cell, idx) => (
                        <td key={idx} style={{ cursor: 'pointer' }}>
                          <DropdownList cell={cell} />
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          {fixedRightColumns && (
            <td>
              <table className={styles.rightTable}>
                <thead>
                  <tr>
                    {fixedRightColumns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      {data[index]
                        .slice(-fixedRightColumns.length)
                        .map((cell, idx) => (
                          <td key={idx} style={{ cursor: 'pointer' }}>
                            <DropdownList cell={cell} />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          )}
        </tr>
      </table>
    </div>
  );
};

export default memo(ResultsTable);
