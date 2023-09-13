import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import styles from './groupSelector.module.css';
import { IGroup } from '@custom-types/data/IGroup';
import { InputWrapper } from '@ui/basics';
import inputStyles from '@styles/ui/input.module.css';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';

const GroupSelector: FC<{
  form: any;
  groups: IGroup[];
  initialGroups: string[];
  classNames?: any;
  field: string;
  shrink?: boolean;
}> = ({
  form,
  groups: allGroups,
  initialGroups,
  field,
  shrink,
  ...props
}) => {
  const { locale } = useLocale();
  const [groups, setGroups] =
    useState<ICustomTransferListData>(undefined);

  useEffect(() => {
    let data: ICustomTransferListData = [[], []];

    for (let i = 0; i < allGroups.length; i++) {
      const group = {
        ...allGroups[i],
        label: allGroups[i].name,
        sortValue: allGroups[i].name,
      };
      if (initialGroups.includes(group.spec)) {
        data[1].push(group);
      } else {
        data[0].push(group);
      }
    }

    setGroups(data);
  }, [allGroups, initialGroups]);

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
          {item.name}
        </div>
      );
    },
    [shrink]
  );

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!!!data) return;
      form.setFieldValue(
        field,
        data[1].map((item) => item.spec)
      );
      setGroups(data);
    },
    [form.setFieldValue] // eslint-disable-line
  );

  return (
    <div>
      <InputWrapper shrink={shrink} {...form.getInputProps(field)}>
        <CustomTransferList
          value={groups}
          onChange={onChange}
          titles={[
            locale.ui.groupSelector.unselected,
            locale.ui.groupSelector.selected,
          ]}
          itemComponent={itemComponent}
          searchKeys={['name']}
        />
      </InputWrapper>
    </div>
  );
};

export default memo(GroupSelector);
