import { ITableColumn } from '@custom-types/ui/ITable';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactNode } from 'react';
import tableStyles from '@styles/ui/customTable.module.css';
import { ILocale } from '@custom-types/ui/ILocale';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { Check, Pencil, Plus, X } from 'tabler-icons-react';
import { useUser } from '@hooks/useUser';
import { IGroupDisplay } from '@custom-types/data/IGroup';
import { Icon } from '@ui/basics';
import GroupList from '@ui/GroupList/GroupList';
import DeleteModal from '@components/Group/DeleteModal/DeleteModal';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.group.list.name,
    key: 'name',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.name.value > b.name.value
        ? 1
        : a.name.value == b.name.value
        ? 0
        : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 4,
  },
  {
    label: locale.group.list.participants,
    key: 'participants',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.participants.value > b.participants.value
        ? 1
        : a.participants.value == b.participants.value
        ? 0
        : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.group.list.readonly,
    key: 'readonly',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.readonly.value > b.readonly.value
        ? 1
        : a.readonly.value == b.readonly.value
        ? 0
        : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
];
const refactorGroup = (group: IGroupDisplay): any => ({
  name: {
    value: group.name,
    display: (
      <div className={tableStyles.titleWrapper}>
        <div style={{ color: 'var(--primary)' }}>{group.name}</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 'var(--spacer-xs)',
          }}
        >
          <Icon
            color="var(--primary)"
            size="xs"
            href={`/group/edit/${group.spec}`}
          >
            <Pencil />
          </Icon>
          <DeleteModal group={group} />
        </div>
      </div>
    ),
  },
  participants: {
    value: group.participants,
    display: <div>{group.participants}</div>,
  },
  readonly: {
    value: group.readonly,
    display: (
      <div>
        {group.readonly ? <X color="red" /> : <Check color="green" />}
      </div>
    ),
  },
});

function GroupListPage() {
  const { isTeacher } = useUser();
  const { locale } = useLocale();
  return (
    <div>
      <Title title={locale.titles.group.list} />
      <GroupList
        url={'group/list'}
        refactorGroup={refactorGroup}
        initialColumns={initialColumns}
      />
      {isTeacher && (
        <SingularSticky
          color="var(--positive)"
          href={`/group/add`}
          icon={<Plus height={25} width={25} />}
          description={locale.tip.sticky.group.add}
        />
      )}
    </div>
  );
}

GroupListPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default GroupListPage;
