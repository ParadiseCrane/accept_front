import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import styles from './groupSelector.module.css';
import { IGroup } from '@custom-types/data/IGroup';
import inputStyles from '@styles/ui/input.module.css';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';

const GroupSelector: FC<{
  form: any;
  groups: IGroup[];
  initialGroups: string[];
  field: string;
  shrink?: boolean;
  width?: string;
}> = ({
  form,
  groups: allGroups,
  initialGroups,
  field,
  shrink,
  width,
}) => {
  const { locale } = useLocale();
  const [groups, setGroups] =
    useState<ICustomTransferListData>(undefined);

  useEffect(() => {
    let data: ICustomTransferListData = [[], []];

    for (let i = 0; i < allGroups.length; i++) {
      const group = {
        ...allGroups[i],
        value: allGroups[i].spec,
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
      <CustomTransferList
        {...form.getInputProps(field)}
        width={width}
        value={groups}
        onChange={onChange}
        titles={[
          locale.ui.groupSelector.unselected,
          locale.ui.groupSelector.selected,
        ]}
        itemComponent={itemComponent}
        searchKeys={['name']}
        shrink={shrink}
      />
    </div>
  );
};

export default memo(GroupSelector);
