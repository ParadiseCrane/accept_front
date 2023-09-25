import { useLocale } from '@hooks/useLocale';
import { FC, ReactNode, memo } from 'react';
import tableStyles from '@styles/ui/primitiveTable.module.css';
import PrimitiveTable from '@ui/PrimitiveTable/PrimitiveTable';
import { ITag } from '@custom-types/data/ITag';
import { ITaskDisplay } from '@custom-types/data/ITask';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';
import Link from 'next/link';

const PrimitiveTaskTable: FC<{
  tasks: ITaskDisplay[];
  linkQuery?: string;
  empty?: ReactNode;
}> = ({ tasks, linkQuery, empty }) => {
  const { locale } = useLocale();

  return (
    <PrimitiveTable
      columns={[
        locale.task.list.title,
        locale.task.list.author,
        locale.task.list.verdict,
      ]}
      columnSizes={[4, 1, 1]}
      rows={tasks}
      empty={empty}
      rowComponent={(row: any) => {
        return (
          <>
            <td className={tableStyles.titleWrapper}>
              <Link
                href={`/task/${row.spec}${
                  linkQuery ? '?' + linkQuery : ''
                }`}
                className={tableStyles.title}
              >
                {row.title}
              </Link>
              {row.tags.length > 0 && (
                <span className={tableStyles.tags}>
                  {row.tags.map((tag: ITag, idx: number) => (
                    <div className={tableStyles.tag} key={idx}>
                      {tag.title +
                        (idx == row.tags.length - 1 ? '' : ', ')}
                    </div>
                  ))}
                </span>
              )}
            </td>
            <td className={tableStyles.cell}>{row.author}</td>
            <td className={tableStyles.cell}>
              <VerdictWrapper verdict={row.verdict} />
            </td>
          </>
        );
      }}
      classNames={{
        column: tableStyles.column,
        row: tableStyles.row,
        table: tableStyles.table,
        even: tableStyles.even,
      }}
    />
  );
};

export default memo(PrimitiveTaskTable);
