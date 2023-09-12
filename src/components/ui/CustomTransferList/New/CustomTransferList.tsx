import { FC, ReactNode, memo, useCallback, useMemo } from 'react';
import {
  ICustomTransferListData,
  ICustomTransferListItem,
  ICustomTransferListItemComponent,
  ICustomTransferListItemComponentProps,
} from '@custom-types/ui/basics/customTransferList';
import InputWrapper from '@ui/basics/InputWrapper/InputWrapper';
import { MyInputWrapperProps } from '@custom-types/ui/basics/inputWrapper';
import { LoadingOverlay } from '@ui/basics';
import {
  SelectField,
  SelectFieldClassNames,
} from './SelectField/SelectField';
import { ClassNames } from '@mantine/core';

import styles from './customTransferList.module.css';

interface TransferListClassNames extends ClassNames<'wrapper'> {
  selectFieldClassNames?: SelectFieldClassNames;
}

const defaultClassNames: TransferListClassNames = {
  wrapper: styles.wrapper,
};

const defaultItemComponent = ({
  item,
  onClick,
  index,
}: ICustomTransferListItemComponentProps): ReactNode => (
  <div
    key={index}
    onClick={onClick}
    className={styles.defaultItemWrapper}
  >
    {item.label}
  </div>
);

const compareItems = (
  a: ICustomTransferListItem,
  b: ICustomTransferListItem
): 1 | 0 | -1 => {
  if ((a.sortValue = b.sortValue)) {
    return 0;
  }
  if (a.sortValue > b.sortValue) {
    return 1;
  }
  return -1;
};

const hashItems = (items: ICustomTransferListItem[]) =>
  items.map((item) => item.label).join();

interface CustomTransferListProps
  extends Omit<
    MyInputWrapperProps,
    'children' | 'onChange' | 'classNames'
  > {
  value: ICustomTransferListData;
  onChange: (_: ICustomTransferListData) => void;
  titles?: [string, string];
  loading?: boolean;
  itemComponent?: ICustomTransferListItemComponent;
  sortOrder?: 1 | -1;
  searchKeys?: string[];
  classNames?: TransferListClassNames;
}

const CustomTransferList: FC<CustomTransferListProps> = ({
  value,
  onChange,
  loading,
  titles = ['', ''],
  itemComponent = defaultItemComponent,
  sortOrder = 1,
  searchKeys = ['label'],
  classNames = defaultClassNames,
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
    <InputWrapper
      classNames={{ root: classNames.wrapper }}
      {...props}
    >
      <LoadingOverlay visible={!!loading} />
      <SelectField
        title={titles[0]}
        value={innerValue[0]}
        selectItems={selectItems}
        itemComponent={itemComponent}
        searchKeys={searchKeys}
        rightSection
        classNames={classNames.selectFieldClassNames}
      />
      <SelectField
        title={titles[1]}
        value={innerValue[1]}
        selectItems={unselectItems}
        itemComponent={itemComponent}
        searchKeys={searchKeys}
        leftSection
        classNames={classNames.selectFieldClassNames}
      />
    </InputWrapper>
  );
};

export default memo(CustomTransferList);
