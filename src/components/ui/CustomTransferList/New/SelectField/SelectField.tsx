import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styles from './selectField.module.css';
import { Icon, TextInput } from '@ui/basics';
import {
  ICustomTransferListItem,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';
import { callback, pureCallback } from '@custom-types/ui/atomic';
import Fuse from 'fuse.js';
import { ChevronsLeft, ChevronsRight } from 'tabler-icons-react';
import {
  CSSObject,
  ClassNames,
  TextInputStylesNames,
} from '@mantine/core';

export interface SelectFieldClassNames
  extends ClassNames<
    | 'fieldWrapper'
    | 'fieldTitle'
    | 'itemsWrapper'
    | 'inputDescription'
    | 'inputError'
    | 'inputIcon'
    | 'inputInput'
    | 'inputLabel'
    | 'inputRequired'
    | 'inputRightSection'
    | 'inputRoot'
    | 'inputWrapper'
  > {}

const defaultClassNames: SelectFieldClassNames = {
  fieldWrapper: styles.wrapper,
  fieldTitle: styles.title,
  itemsWrapper: styles.items,
};

const inputStyles: Partial<Record<TextInputStylesNames, CSSObject>> =
  { icon: { pointerEvents: 'unset' } };

const SelectFieldComponent: FC<{
  title: string;
  value: ICustomTransferListItem[];
  selectItems: callback<string[], pureCallback<void>>;
  itemComponent: ICustomTransferListItemComponent;
  searchKeys: string[];
  classNames?: SelectFieldClassNames;
  leftSection?: boolean;
  rightSection?: boolean;
}> = ({
  title,
  value,
  selectItems,
  itemComponent,
  searchKeys,
  leftSection: withLeftSection,
  rightSection: withRightSection,
  classNames: classNamesProp,
}) => {
  const [search, setSearch] = useState('');

  const classNames: SelectFieldClassNames = useMemo(
    () => ({ ...defaultClassNames, ...classNamesProp }),
    [classNamesProp]
  );

  const inputClassNames = useMemo(
    () => ({
      description: classNames.inputDescription,
      error: classNames.inputError,
      icon: classNames.inputIcon,
      input: classNames.inputInput,
      label: classNames.inputLabel,
      required: classNames.inputRequired,
      rightSection: classNames.inputRightSection,
      root: classNames.inputRoot,
      wrapper: classNames.inputWrapper,
    }),
    [classNames]
  );

  const selectEverything = useCallback(() => {
    selectItems(value.map((item) => item.label))();
  }, []);

  const leftSection = useMemo(
    () =>
      withLeftSection && (
        <Icon size={'sm'} onClick={selectEverything}>
          <ChevronsLeft />
        </Icon>
      ),
    [withLeftSection]
  );

  const rightSection = useMemo(
    () =>
      withRightSection && (
        <Icon size={'sm'} onClick={selectEverything}>
          <ChevronsRight />
        </Icon>
      ),
    []
  );

  const fuse = useMemo(
    () =>
      new Fuse(value, {
        keys: searchKeys,
        findAllMatches: true,
      }),
    [value, searchKeys] // eslint-disable-line
  );

  const filteredItems = useMemo(() => {
    if (search.length == 0) return value;

    return fuse.search(search).map((result) => result.item);
  }, [fuse, search, value]);

  const onSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  return (
    <div className={classNames.fieldWrapper}>
      <div className={classNames.fieldTitle}>{title}</div>
      <TextInput
        value={search}
        onChange={onSearch}
        styles={inputStyles}
        classNames={inputClassNames}
        icon={leftSection}
        rightSection={rightSection}
        placeholder="Поиск"
      />
      <div className={classNames.itemsWrapper}>
        {filteredItems.map((item, index) =>
          itemComponent({
            item,
            onClick: selectItems([item.label]),
            index,
          })
        )}
      </div>
    </div>
  );
};

export const SelectField = memo(SelectFieldComponent);
