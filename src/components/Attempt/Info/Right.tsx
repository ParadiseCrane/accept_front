"use client";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styles from "./styles.module.css";
import tableStyles from "@styles/ui/customTable.module.css";
import { ITestResult } from "@custom-types/data/atomic";
import { useLocale } from "@hooks/useLocale";
import { IAttempt } from "@custom-types/data/IAttempt";
import VerdictWrapper from "@ui/VerdictWrapper/VerdictWrapper";

const MAX_ROWS_IN_TABLE = 10;
const MAX_TABLES = 3;

const distributeRows = (rows: IRowItem[]): Array<Array<IRowItem>> => {
  const length = rows.length;
  const threshold = MAX_TABLES * MAX_ROWS_IN_TABLE;
  let counts: number[] = [];

  if (length <= threshold) {
    for (let i = 0; i < MAX_TABLES; i++) {
      const alreadyAllocated = MAX_ROWS_IN_TABLE * i;
      const remaining = Math.max(length - alreadyAllocated, 0);
      counts[i] = Math.min(remaining, MAX_ROWS_IN_TABLE);
    }
  } else {
    const base = Math.floor(length / MAX_TABLES);
    const remaining = length % MAX_TABLES;
    for (let i = 0; i < MAX_TABLES; i++) {
      counts[i] = base + (i < remaining ? 1 : 0);
    }
  }

  const result: Array<Array<IRowItem>> = [];
  let offset = 0;
  for (let count of counts) {
    result.push(rows.slice(offset, offset + count));
    offset += count;
  }

  return result.filter((array) => array.length !== 0);
};

interface IRowItem extends ITestResult {
  index: number;
}

interface Props {
  attempt: IAttempt;
  syncScroll: boolean;
}

const Right: FC<Props> = ({ attempt, syncScroll }) => {
  const { locale } = useLocale();

  const tableRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isSyncingScroll = useRef(false);

  const rows: IRowItem[] = useMemo(
    () =>
      attempt.results.map((row, index) => ({
        ...row,
        index: index + 1, // row.test + 1
      })),
    [attempt.results],
  );
  const columnSizes = useMemo(() => [1, 2], []);

  const columns = useMemo(
    () => [locale.attempt.test, locale.attempt.result],
    [locale.attempt.result, locale.attempt.test],
  );

  const gridTemplate = useMemo(() => {
    let total = 0;
    if (!columnSizes || columnSizes.length < columns.length) {
      total = columns.length;
      return {
        gridTemplateColumns: columns.map((_) => 100 / total).join("% ") + "%",
      };
    }
    for (let i = 0; i < columns.length; i++) {
      total += columnSizes[i];
    }
    return {
      gridTemplateColumns:
        columns.map((_, idx) => (columnSizes[idx] / total) * 100).join("% ") +
        "%",
    };
  }, [columnSizes, columns]);

  const handleScroll = useCallback((index: number) => {
    return (e: React.UIEvent<HTMLDivElement>) => {
      if (isSyncingScroll.current) return;

      isSyncingScroll.current = true;
      const scrollTop = e.currentTarget.scrollTop;

      tableRefs.current.forEach((ref, i) => {
        if (i !== index && ref) {
          ref.scrollTop = scrollTop;
        }
      });

      requestAnimationFrame(() => {
        isSyncingScroll.current = false;
      });
    };
  }, []);

  const setRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) tableRefs.current[index] = el;
  }, []);

  const tables: Array<Array<IRowItem>> = distributeRows(rows);

  useEffect(() => {
    tableRefs.current = tableRefs.current.slice(0, tables.length);
  }, [tables]);

  return (
    <div className={styles.right}>
      {tables.length > 0 &&
        tables.map((table, index) => (
          <div
            className={styles.tableWrapper}
            ref={(el) => setRef(el, index)}
            key={index}
            onScroll={syncScroll ? handleScroll(index) : undefined}
          >
            {table.length > 0 && (
              <table className={tableStyles.table}>
                <thead>
                  <tr className={tableStyles.row} style={gridTemplate}>
                    {columns.map((column, index) => (
                      <th key={index} className={styles.column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.map((row, index) => (
                    <tr
                      key={`${row.verdict.spec} ${index}`}
                      className={
                        tableStyles.row +
                        " " +
                        (index % 2 === 0 ? tableStyles.even : "")
                      }
                      style={gridTemplate}
                    >
                      <td className={`${tableStyles.cell} ${styles.cell}`}>
                        {row.index}
                      </td>
                      <td className={`${tableStyles.cell} ${styles.cell}`}>
                        <VerdictWrapper verdict={row.verdict} full />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
    </div>
  );
};

export const RightComponent = memo<Props>(Right);
