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
  Props as DefaultSelectFieldProps,
  SelectField,
} from './SelectField/SelectField';

import styles from './customTransferList.module.css';

interface Props
  extends Omit<
    MyInputWrapperProps,
    'children' | 'onChange' | 'classNames' | 'styles'
  > {
  value: ICustomTransferListData;
  // TODO: add className types
  classNames?: any;
  styles?: any;
  onChange: (_: ICustomTransferListData) => void;
  titles?: [string, string];
  loading?: boolean;
  itemComponent?: ICustomTransferListItemComponent;
  sortOrder?: 1 | -1;
  searchKeys?: string[];
  selectFieldProps?: DefaultSelectFieldProps;
  height?: string;
  width?: string;
  extraActions?: [ReactNode[], ReactNode[]];
}

const defaultItemComponent = ({
  item,
  onClick,
  index,
}: ICustomTransferListItemComponentProps): ReactNode => (
  <div key={index} onClick={onClick} className={styles.defaultItemWrapper}>
    {item.value}
  </div>
);

const compareItems = (
  a: ICustomTransferListItem,
  b: ICustomTransferListItem
): 1 | 0 | -1 => {
  if (a.sortValue == b.sortValue) {
    return 0;
  }
  if (a.sortValue > b.sortValue) {
    return 1;
  }
  return -1;
};

const CustomTransferList: FC<Props> = ({
  value,
  onChange,
  loading,
  titles = ['', ''],
  itemComponent = defaultItemComponent,
  sortOrder = 1,
  searchKeys = ['label'],
  classNames,
  selectFieldProps: selectFieldClassNames,
  styles: _innerStyles,
  height = '350px',
  width = '100%',
  extraActions = [[], []],
  ...props
}) => {
  const innerValue: ICustomTransferListData = useMemo(() => {
    let data: ICustomTransferListData = [[], []];
    if (value && value.length == 2) {
      value[0].sort((a, b) => compareItems(a, b) * sortOrder);
      value[1].sort((a, b) => compareItems(a, b) * sortOrder);
      data = value;
    }
    return data;
  }, [sortOrder, value]);

  const moveFromTo = useCallback(
    (labels: string[], from: 0 | 1, to: 0 | 1) => {
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
        if (labels.includes(item.value)) {
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

  const inputStyles = useMemo(() => {
    let rootStyles = { root: {} };
    if (!!height) {
      rootStyles.root = {
        maxHeight: height,
        height,
      };
    }
    return rootStyles;
  }, [height]);

  return (
    <InputWrapper styles={inputStyles} {...props}>
      <div
        style={{ ...inputStyles.root, maxWidth: width, width }}
        className={classNames ? classNames.wrapper : styles.wrapper}
      >
        <LoadingOverlay visible={!!loading} />
        <SelectField
          title={titles[0]}
          value={innerValue[0]}
          selectItems={selectItems}
          itemComponent={itemComponent}
          searchKeys={searchKeys}
          rightSection
          extraActions={extraActions[0]}
          classNames={selectFieldClassNames}
        />
        <SelectField
          title={titles[1]}
          value={innerValue[1]}
          selectItems={unselectItems}
          itemComponent={itemComponent}
          searchKeys={searchKeys}
          leftSection
          extraActions={extraActions[1]}
          classNames={selectFieldClassNames}
        />
      </div>
    </InputWrapper>
  );
};

export default memo(CustomTransferList);
