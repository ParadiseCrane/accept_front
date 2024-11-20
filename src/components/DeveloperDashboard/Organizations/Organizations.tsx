import { FC, memo, useCallback, useState } from 'react';
import { useRequest } from '@hooks/useRequest';
import {
  Button,
  Icon,
  LoadingOverlay,
  Select,
  TextArea,
  TextInput,
  Tip,
} from '@ui/basics';
import tableStyles from '@styles/ui/customTable.module.css';

import { useForm } from '@mantine/form';
import { requestWithError } from '@utils/requestWithError';
import { ExecutorBundle, IExecutor } from '@custom-types/data/IExecutor';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import modalStyles from '@styles/ui/modal.module.css';
import { isJSON } from '@utils/isJSON';
import OrganizationList from '@ui/OrganizationList/OrganizationList';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { IGroupDisplay } from '@custom-types/data/IGroup';
import { Check, Pencil, Plus, X } from 'tabler-icons-react';
import DeleteModal from '@components/Organization/DeleteModal/DeleteModal';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { IOrganization } from '@custom-types/data/IOrganization';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.organization.list.spec,
    key: 'spec',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.spec.value > b.spec.value ? 1 : a.spec.value == b.spec.value ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.organization.list.name,
    key: 'name',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.name.value > b.name.value ? 1 : a.name.value == b.name.value ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 4,
  },
  {
    label: locale.organization.list.allowRegistration,
    key: 'allowRegistration',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.allowRegistration.value > b.allowRegistration.value
        ? 1
        : a.allowRegistration.value == b.allowRegistration.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
];
const refactorOrganization = (organization: IOrganization): any => ({
  spec: {
    value: organization.spec,
    display: organization.spec,
  },

  name: {
    value: organization.name,
    display: (
      <div className={tableStyles.titleWrapper}>
        <div style={{ color: 'var(--primary)' }}>{organization.name}</div>
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
            href={`/organization/edit/${organization.spec}`}
          >
            <Pencil />
          </Icon>
          <DeleteModal organization={organization} />
        </div>
      </div>
    ),
  },
  allowRegistration: {
    value: organization.allowRegistration,
    display: (
      <div>
        {organization.allowRegistration ? (
          <Check color="green" />
        ) : (
          <X color="red" />
        )}
      </div>
    ),
  },
});

const Organizations: FC<{}> = ({}) => {
  const { locale } = useLocale();

  return (
    <div>
      <OrganizationList
        noDefault
        url={'organization/list'}
        refactorOrganization={refactorOrganization}
        initialColumns={initialColumns}
      />

      <SingularSticky
        color="var(--positive)"
        href={`/organization/add`}
        icon={<Plus height={25} width={25} />}
        description={locale.tip.sticky.group.add}
      />
    </div>
  );
};

export default memo(Organizations);
