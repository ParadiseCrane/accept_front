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
      console.log(labels);
      console.log(innerValue);
      let data: ICustomTransferListData = [...innerValue];
      if (labels.length == 0) {
        data[to].push(...data[from]);
        data[from] = [];
        onChange(data);
        return;
      }
      let newFrom = [];

      for (let index = 0; index < data[from].length; index++) {
        const item = data[from][index];
        if (labels.includes(item.label)) {
          data[to].push(item);
          continue;
        }
        newFrom.push(item);
      }
      data[from] = newFrom;
      data[to].sort((a, b) => compareItems(a, b) * sortOrder);

      onChange(data);
    },
    [innerValue, onChange, sortOrder]
  );

  const selectItems = useCallback(
    (labels: string[]) => {
      return () => moveFromTo(labels, 0, 1);
    },
    [moveFromTo]
  );

  const unselectItems = useCallback(
    (labels: string[]) => {
      return () => moveFromTo(labels, 1, 0);
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
