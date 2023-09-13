import { useLocale } from '@hooks/useLocale';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import styles from './roleSelector.module.css';
import { InputWrapper } from '@ui/basics';
import { IRole } from '@custom-types/data/atomic';
import { capitalize } from '@utils/capitalize';
import inputStyles from '@styles/ui/input.module.css';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';

const RoleSelector: FC<{
  form: any;
  roles: IRole[];
  initialRoles: number[];
  classNames?: any;
  field: string;
  shrink?: boolean;
}> = ({
  form,
  roles: allRoles,
  initialRoles,
  classNames,
  field,
  shrink,
}) => {
  const { locale } = useLocale();

  const initialRolesInner = useMemo(() => initialRoles, []); //eslint-disable-line
  const [roles, setRoles] =
    useState<ICustomTransferListData>(undefined);

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!!!data) return;
      form.setFieldValue(
        field,
        data[1].map((role) => role.spec)
      ),
        setRoles(data);
    },
    [field, form.setFieldValue] //eslint-disable-line
  );

  useEffect(() => {
    let data: ICustomTransferListData = [[], []];

    for (let i = 0; i < allRoles.length; i++) {
      const role = {
        ...allRoles[i],
        value: allRoles[i].spec.toString(),
        label: allRoles[i].name,
        sortValue: allRoles[i].name,
      };
      if (initialRolesInner.includes(role.spec)) {
        data[1].push(role);
      } else {
        data[0].push(role);
      }
    }
    setRoles(data);
  }, [initialRolesInner, allRoles]);

  const itemComponent: ICustomTransferListItemComponent = useCallback(
    ({ item, onClick, index }) => {
      return (
        <div
          key={index}
          className={`${styles.itemWrapper} ${
            shrink ? inputStyles.shrink : ''
          }`}
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        >
          {capitalize(item.name)}
        </div>
      );
    },
    [shrink]
  );

  return (
    <div>
      <InputWrapper shrink={shrink} {...form.getInputProps(field)}>
        <CustomTransferList
          value={roles}
          onChange={onChange}
          // classNames={classNames || {}}
          shrink={shrink}
          titles={[
            locale.ui.roleSelector.unselected,
            locale.ui.roleSelector.selected,
          ]}
          itemComponent={itemComponent}
          searchKeys={['name']}
        />
      </InputWrapper>
    </div>
  );
};

export default memo(RoleSelector);
