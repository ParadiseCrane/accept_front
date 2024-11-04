import {
  ChangeEvent,
  FC,
  ReactNode,
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
import useVirtual from 'react-cool-virtual';
import { MyIconProps } from '@custom-types/ui/basics/icon';
import { useLocale } from '@hooks/useLocale';

export interface Props {
  title: string;
  value: ICustomTransferListItem[];
  selectItems: callback<string[], pureCallback<void>>;
  itemComponent: ICustomTransferListItemComponent;
  searchKeys: string[];
  leftSection?: boolean;
  rightSection?: boolean;
  extraActions?: ReactNode[];
  classNames: any;
}

const defaultClassNames = {
  fieldWrapper: styles.wrapper,
  fieldTitle: styles.title,
  itemsWrapper: styles.items,
  titleSearchWrapper: styles.titleSearchWrapper,
};

const inputStyles: any = {
  icon: { pointerEvents: 'unset' },
};

const SelectFieldComponent: FC<Props> = ({
  title,
  value,
  selectItems,
  itemComponent,
  searchKeys,
  leftSection: withLeftSection,
  rightSection: withRightSection,
  extraActions,
  classNames: classNamesProp,
}) => {
  const { locale } = useLocale();

  const [search, setSearch] = useState('');

  const classNames = useMemo(
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

  const iconProps: MyIconProps = useMemo(
    () => ({
      size: 'sm',
      color: 'var(--primary)',
      onClick: selectItems([]),
    }),
    [selectItems]
  );

  const leftSection = useMemo(
    () =>
      withLeftSection && (
        <Icon {...iconProps}>
          <ChevronsLeft />
        </Icon>
      ),
    [iconProps, withLeftSection]
  );

  const rightSection = useMemo(
    () =>
      withRightSection && (
        <Icon {...iconProps}>
          <ChevronsRight />
        </Icon>
      ),
    [iconProps, withRightSection]
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

  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: filteredItems.length,
    overscanCount: 10,
  });

  return (
    <div className={classNames.fieldWrapper}>
      <div className={classNames.titleSearchWrapper}>
        <div className={classNames.fieldTitle}>{title}</div>
        <div className={styles.searchWrapper}>
          {withLeftSection && <>{extraActions?.map((item) => item)}</>}
          <TextInput
            value={search}
            onChange={onSearch}
            styles={inputStyles}
            classNames={inputClassNames}
            leftSection={leftSection}
            rightSection={rightSection}
            placeholder={locale.form.search}
          />
          {withRightSection && <>{extraActions?.map((item) => item)}</>}
        </div>
      </div>
      <div className={classNames.itemsWrapper} ref={outerRef}>
        <div ref={innerRef}>
          {items.map(({ index, measureRef }) => (
            <div key={index} ref={measureRef}>
              {index < filteredItems.length &&
                itemComponent({
                  item: filteredItems[index],
                  onClick: selectItems([filteredItems[index].value]),
                  index,
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SelectField = memo(SelectFieldComponent);
