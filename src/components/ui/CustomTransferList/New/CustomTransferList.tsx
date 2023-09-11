import { FC, memo, useCallback, useMemo } from 'react';
import {
  ICustomTransferListData,
  ICustomTransferListItem,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';
import InputWrapper from '@ui/basics/InputWrapper/InputWrapper';
import { MyInputWrapperProps } from '@custom-types/ui/basics/inputWrapper';
import { LoadingOverlay } from '@ui/basics';
import styles from './customTransferList.module.css';
import { SelectField } from './SelectField/SelectField';

interface CustomTransferListProps
  extends Omit<MyInputWrapperProps, 'children' | 'onChange'> {
  value: ICustomTransferListData;
  loading?: boolean;
  itemComponent: ICustomTransferListItemComponent;
  onChange: (_: ICustomTransferListData) => void;
  sortOrder: 1 | -1;
  searchKeys: string[];
}

function compareItems(
  a: ICustomTransferListItem,
  b: ICustomTransferListItem
): 1 | 0 | -1 {
  if ((a.sortValue = b.sortValue)) {
    return 0;
  }
  if (a.sortValue > b.sortValue) {
    return 1;
  }
  return -1;
}

const hashItems = (items: ICustomTransferListItem[]) =>
  items.map((item) => item.label).join();

const CustomTransferList: FC<CustomTransferListProps> = ({
  value,
  loading,
  itemComponent,
  sortOrder,
  onChange,
  searchKeys,
  ...props
}) => {
  const innerValue: ICustomTransferListData = useMemo(
    () => value || [[], []],
    [value]
  );

  const moveFromTo = useCallback(
    (labels: string[], from: 0 | 1, to: 0 | 1) => {
      let data: ICustomTransferListData = [...innerValue];
      for (let i = 0; i < labels.length; i++) {
        const index = data[from].findIndex(
          (item) => item.label == labels[i]
        );
        const [item] = data[from].splice(index, 1);

        data[to].push(item);
      }

      data[to].sort((a, b) => compareItems(a, b) * sortOrder);

      onChange(data);
    },
    [innerValue, onChange, sortOrder]
  );

  const selectItems = useCallback(
    (label: string[]) => {
      return () => moveFromTo(label, 0, 1);
    },
    [moveFromTo]
  );

  const unselectItems = useCallback(
    (label: string[]) => {
      return () => moveFromTo(label, 1, 0);
    },
    [moveFromTo]
  );

  return (
    <InputWrapper className={styles.wrapper} {...props}>
      <LoadingOverlay visible={!!loading} />
      <SelectField
        key={'0' + hashItems(innerValue[0])}
        title={'first'}
        value={innerValue[0]}
        selectItems={selectItems}
        itemComponent={itemComponent}
        searchKeys={searchKeys}
        rightSection
      />
      <SelectField
        key={'1' + hashItems(innerValue[1])}
        title={'second'}
        value={innerValue[1]}
        selectItems={unselectItems}
        itemComponent={itemComponent}
        searchKeys={searchKeys}
        leftSection
      />
    </InputWrapper>
  );
};

export default memo(CustomTransferList);
