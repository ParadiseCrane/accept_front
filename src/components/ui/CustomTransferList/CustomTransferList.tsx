import { removeOneElement } from '@utils/removeOneElement';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SelectField } from './SelectField/SelectField';
import styles from './customTransferList.module.css';
import { pureCallback, setter } from '@custom-types/ui/atomic';
import createFastContext from '@hooks/useStore';

export const { Provider, useStore } = createFastContext({
  options: [] as Item[],
  chosen: [] as Item[],
});

export interface Item {
  label: string;
  [key: string]: any;
}
export type TransferListData = [Item[], Item[]];

const cmpItem = (a: Item, b: Item) => {
  if (a.label === b.label) {
    return 0;
  }
  if (a.label > b.label) {
    return 1;
  }
  return -1;
};

interface InnerTransferListProps {
  defaultOptions: Item[];
  defaultChosen: Item[];
  setUsed: setter<Item[]>;
  titles: [string, string];
  classNames: any;
  rightComponent?: pureCallback<ReactNode>;
  itemComponent: (_: any, __: any) => ReactNode;
  shouldSortChosen?: boolean;
  searchKeys?: string[];
  shrink?: boolean;
}

interface CustomTransferListProps extends InnerTransferListProps {}

const InnerTransferList: FC<InnerTransferListProps> = ({
  defaultChosen,
  defaultOptions,
  setUsed,
  titles,
  classNames,
  rightComponent,
  itemComponent,
  shouldSortChosen,
  searchKeys,
  shrink,
}) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [chosen, set] = useStore((store) => store['chosen']);
  const [options] = useStore((store) => store['options']);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    setUsed(chosen);
  }, [chosen, setUsed]); // eslint-disable-line

  useEffect(() => {
    set({ options: defaultOptions.sort(cmpItem) });
  }, [defaultOptions, set]);

  useEffect(() => {
    set({
      chosen: shouldSortChosen
        ? defaultChosen.sort(cmpItem)
        : defaultChosen,
    });
  }, [defaultChosen, defaultOptions, set, shouldSortChosen]);

  const handleSelectLeft = useCallback(
    (item: Item) => {
      set({
        options: removeOneElement(options, item),
        chosen: shouldSortChosen
          ? [...chosen, item].sort(cmpItem)
          : [...chosen, item],
      });
    },
    [chosen, options, set, shouldSortChosen]
  );

  const handleSelectRight = useCallback(
    (item: Item) => {
      set({
        options: [...options, item].sort(cmpItem),
        chosen: removeOneElement(chosen, item),
      });
    },
    [chosen, options, set]
  );

  return (
    <div
      className={`${styles.wrapper} ${
        classNames?.customTransferListWrapper
          ? classNames.customTransferListWrapper
          : ''
      }  ${shrink ? styles.shrink : ''}`}
    >
      <div className={styles.leftWrapper}>
        <SelectField
          classNames={classNames}
          title={titles[0]}
          field={'options'}
          handleSelect={handleSelectLeft}
          rightComponent={rightComponent}
          itemComponent={itemComponent}
          searchKeys={searchKeys}
          shrink={shrink}
        />
      </div>
      <div className={styles.rightWrapper}>
        <SelectField
          classNames={classNames}
          title={titles[1]}
          field={'chosen'}
          handleSelect={handleSelectRight}
          itemComponent={itemComponent}
          searchKeys={searchKeys}
          shrink={shrink}
        />
      </div>
    </div>
  );
};

export const CustomTransferList: FC<CustomTransferListProps> = ({
  ...props
}) => {
  return (
    <Provider>
      <InnerTransferList {...props} />
    </Provider>
  );
};
