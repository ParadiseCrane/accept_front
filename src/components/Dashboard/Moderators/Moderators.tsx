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

const refactorPair = (
  pair: ICourseModeratorGroup,
  isAuthor: boolean,
  locale: ILocale,
  handleDelete: any
): ICourseModeratorGroupItem => ({
  ...pair,
  group: {
    value: pair.group,
    display: (
      <div className={tableStyles.titleWrapper}>
        {/* TODO добавить реальную ссылку на группу */}
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
        {/* TODO добавить реальную ссылку на модератора */}
        <Link
          href={`/profile/${pair.moderator.login}`}
          className={tableStyles.title}
        >
          {pair.moderator.shortName}
        </Link>
        {isAuthor && (
          // TODO add action for button
          <Tip label={locale.dashboard.course.deleteModerator}>
            <Icon
              onClick={handleDelete}
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
  const params = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = useCallback(
    (moderator: IUserBaseInfo) => {
      const body = {
        moderator: moderator.login,
      };
      requestWithNotify(
        `course_moderator/delete/${spec}`,
        'DELETE',
        locale.notify.moderator.delete,
        lang,
        (_: any) => '',
        body,
        () => {},
        { autoClose: 8000 }
      );
    },
    [spec, locale, lang]
  );

  return (
    <div className={styles.wrapper}>
      <GroupModeratorList
        url={`course/moderator_group/${spec}`}
        refactorPair={(pair: ICourseModeratorGroup) =>
          refactorPair(pair, isAuthor, locale, handleDelete)
        }
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
      <Button onClick={() => setShowModal(true)}>Open</Button>
      <AddModeratorModal
        isOpened={showModal}
        close={() => setShowModal(false)}
      />
    </div>
  );
};

export default memo(Moderators);
