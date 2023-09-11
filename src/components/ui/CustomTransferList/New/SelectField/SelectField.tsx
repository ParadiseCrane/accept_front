import {
  ChangeEvent,
  FC,
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

export const SelectField: FC<{
  title: string;
  value: ICustomTransferListItem[];
  selectItems: callback<string[], pureCallback<void>>;
  itemComponent: ICustomTransferListItemComponent;
  searchKeys: string[];
  leftSection?: boolean;
  rightSection?: boolean;
}> = ({
  title,
  value,
  selectItems,
  itemComponent,
  searchKeys,
  leftSection,
  rightSection,
}) => {
  const [search, setSearch] = useState('');

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

  const selectEverything = useCallback(() => {
    selectItems(value.map((item) => item.label))();
  }, [selectItems, value]);

  const onSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <TextInput
        value={search}
        onChange={onSearch}
        styles={{ icon: { pointerEvents: 'unset' } }}
        icon={
          leftSection && (
            <Icon size={'sm'} onClick={selectEverything}>
              <ChevronsLeft />
            </Icon>
          )
        }
        rightSection={
          rightSection && (
            <Icon size={'sm'} onClick={selectEverything}>
              <ChevronsRight />
            </Icon>
          )
        }
      />
      <div className={styles.items}>
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
