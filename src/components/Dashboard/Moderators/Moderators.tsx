import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';
import Link from 'next/link';
import { FC, memo, useCallback, useState } from 'react';

import styles from './style.module.css';
import { useSearchParams } from 'next/navigation';
import GroupModeratorList, {
  ICourseModeratorGroupItem,
} from '@ui/GroupModeratorList/GroupModeratorList';
import { ICourseModeratorGroup } from '@custom-types/data/ICourse';
import { Trash } from 'tabler-icons-react';
import { Button, Icon, Tip } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { IUserBaseInfo } from '@custom-types/data/IUser';
import { sendRequest } from '@requests/request';
import { AddModeratorModal } from './AddModeratorModal/AddModeratorModal';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.dashboard.course.group,
    key: 'group',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.group.value.name > b.group.value.name
        ? 1
        : a.group.value.name == b.group.value.name
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.dashboard.course.moderator,
    key: 'moderator',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.moderator.value.shortName > b.moderator.value.shortName
        ? 1
        : a.moderator.value.shortName == b.moderator.value.shortName
          ? 0
          : -1;
    },
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
];

const refactorPair = ({
  pair,
  fetchData,
  handleDelete,
  isAuthor,
  locale,
}: {
  pair: ICourseModeratorGroup;
  fetchData: () => Promise<void>;
  isAuthor: boolean;
  locale: ILocale;
  handleDelete: (
    moderator: IUserBaseInfo,
    fetchData: () => Promise<void>
  ) => void;
}): ICourseModeratorGroupItem => ({
  ...pair,
  group: {
    value: pair.group,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link
          href={`/group/edit/${pair.group.spec}`}
          className={tableStyles.title}
        >
          {pair.group.name}
        </Link>
      </div>
    ),
  },
  moderator: {
    value: pair.moderator,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link
          href={`/profile/${pair.moderator.login}`}
          className={tableStyles.title}
        >
          {pair.moderator.shortName}
        </Link>
        {isAuthor && (
          <Tip label={locale.dashboard.course.deleteModerator}>
            <Icon
              onClick={() => {
                handleDelete(pair.moderator, fetchData);
              }}
              color="red"
              variant="transparent"
              size="xs"
            >
              <Trash />
            </Icon>
          </Tip>
        )}
      </div>
    ),
  },
});

const Moderators: FC<{
  type: 'course';
  spec: string;
  isAuthor: boolean;
}> = ({ spec, isAuthor }) => {
  const { locale, lang } = useLocale();

  const handleDelete = useCallback(
    (moderator: IUserBaseInfo, fetchData: () => Promise<void>) => {
      requestWithNotify(
        `course_moderator/${spec}/${moderator.login}`,
        'DELETE',
        locale.notify.moderator.delete,
        lang,
        (_: any) => '',
        {},
        fetchData,
        { autoClose: 8000 }
      );
    },
    [spec, locale, lang]
  );

  return (
    <div className={styles.wrapper}>
      <GroupModeratorList
        url={`course/moderator_group/${spec}`}
        refactorPair={({
          pair,
          fetchData,
        }: {
          pair: ICourseModeratorGroup;
          fetchData: () => Promise<void>;
        }) => refactorPair({ pair, fetchData, isAuthor, locale, handleDelete })}
        initialColumns={initialColumns}
        noDefault
        empty={<>{locale.ui.table.emptyMessage}</>}
        classNames={{
          wrapper: tableStyles.wrapper,
          table: tableStyles.table,
          headerCell: styles.headerCell,
          cell: styles.cell,
          even: tableStyles.even,
          odd: tableStyles.odd,
        }}
      />
    </div>
  );
};

export default memo(Moderators);
