import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';
import { getLocalDate } from '@utils/datetime';
import Link from 'next/link';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './info.module.css';
import { Divider } from '@mantine/core';
import PlagiarismButton from '../PlagiarismButton/PlagiarismButton';
import AIHintButton from '../AIHintCollapse/AIHintButton';
import { ITestResult } from '@custom-types/data/atomic';
import AIHintCollapse from '../AIHintCollapse/AIHintCollapse';
import { useDisclosure } from '@mantine/hooks';

const maxRowsInTable = 10;
const maxTables = 3;

const distributeRows = (rows: IRowItem[]): Array<Array<IRowItem>> => {
  const length = rows.length;
  const threshold = maxTables * maxRowsInTable;
  let counts: number[] = [];

  if (length <= threshold) {
    for (let i = 0; i < maxTables; i++) {
      const alreadyAllocated = maxRowsInTable * i;
      const remaining = Math.max(length - alreadyAllocated, 0);
      counts[i] = Math.min(remaining, maxRowsInTable);
    }
  } else {
    const base = Math.floor(length / maxTables);
    const remaining = length % maxTables;
    for (let i = 0; i < maxTables; i++) {
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

const Info: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const { locale } = useLocale();
  const [isBrowser, setIsBrowser] = useState(false);

  const tableRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isSyncingScroll = useRef(false);

  const rows: IRowItem[] = useMemo(
    () =>
      [...attempt.results, ...attempt.results, ...attempt.results].map(
        (row, index) => ({
          ...row,
          index: index + 1, // row.test + 1
        })
      ),
    [attempt.results]
  );
  const columnSizes = useMemo(() => [1, 2], []);

  const columns = useMemo(
    () => [locale.attempt.test, locale.attempt.result],
    [locale.attempt.result, locale.attempt.test]
  );

  const gridTemplate = useMemo(() => {
    let total = 0;
    if (!columnSizes || columnSizes.length < columns.length) {
      total = columns.length;
      return {
        gridTemplateColumns: columns.map((_) => 100 / total).join('% ') + '%',
      };
    }
    for (let i = 0; i < columns.length; i++) {
      total += columnSizes[i];
    }
    return {
      gridTemplateColumns:
        columns.map((_, idx) => (columnSizes[idx] / total) * 100).join('% ') +
        '%',
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
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    tableRefs.current = tableRefs.current.slice(0, tables.length);
  }, [tables]);

  console.log('tables', tables);
  console.log('rows', rows);

  return (
    <div className={styles.infoWrapper} id="attempt_info_section">
      <div className={styles.leftWrapper}>
        <div className={styles.left} id="attempt_left_section">
          <div>{isBrowser && getLocalDate(attempt.date)}</div>
          <div>
            {locale.attempt.task}{' '}
            <Link href={`/task/${attempt.task.spec}`} className={styles.link}>
              {attempt.task.title}
            </Link>
          </div>
          <div>
            {locale.attempt.author}{' '}
            <Link
              href={`/profile/${attempt.author.login}`}
              className={styles.link}
            >
              {attempt.author.shortName}
            </Link>
          </div>
          <div>
            {locale.attempt.language}
            {': '}
            <span>{attempt.language.name}</span>
          </div>
          <div>
            {locale.attempt.status}
            {': '}
            <span>{locale.attempt.statuses[attempt.status.spec]}</span>
          </div>
          {attempt.status.spec == 3 && attempt.banInfo && (
            <div>
              {locale.attempt.banReason}
              {': '}
              <span>{attempt.banInfo.reason}</span>
            </div>
          )}
          <div>
            {locale.attempt.constraints.time}
            {': '}
            <span
              style={{
                fontSize: 'var(--font-size-m)',
              }}
            >
              {attempt.constraints?.time || 0}
              {'s'}
            </span>
          </div>
          <div>
            {locale.attempt.constraints.memory}
            {': '}
            <span>
              {attempt.constraints?.memory || 0}
              {'MB'}
            </span>
          </div>
          {attempt.ai_generated && (
            <>
              <Divider size={'sm'} />
              <div>
                {locale.attempt.aiProbability}
                {': '}
                <span>
                  {attempt.ai_generated}
                  {'%'}
                </span>
              </div>
              <PlagiarismButton
                attempt={attempt}
                customStyle={styles.smallButton}
              />
              <AIHintButton
                attempt={attempt}
                customStyle={styles.smallButton}
                onClick={toggle}
              />
            </>
          )}
        </div>
        <AIHintCollapse
          opened={opened}
          onClose={toggle}
          aiHint={
            'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text'
          }
          spec={attempt.spec}
        />
      </div>
      <div className={styles.right} id="attempt_right_section">
        {tables.length > 0 &&
          tables.map((table, index) => (
            <>
              <div
                className={styles.tableWrapper}
                ref={(el) => setRef(el, index)}
                key={index}
                onScroll={handleScroll(index)}
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
                            ' ' +
                            (index % 2 === 0 ? tableStyles.even : '')
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
            </>
          ))}
      </div>
    </div>
  );
};

export default memo(Info);
