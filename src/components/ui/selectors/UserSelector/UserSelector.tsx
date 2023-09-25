import { useLocale } from '@hooks/useLocale';
import { ILocale } from '@custom-types/ui/ILocale';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import styles from './userSelector.module.css';
import { IUserDisplay } from '@custom-types/data/IUser';
import { Icon, SegmentedControl } from '@ui/basics';
import { Eye } from 'tabler-icons-react';
import inputStyles from '@styles/ui/input.module.css';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';

const UserSelector: FC<{
  setFieldValue: (_: string[]) => void;
  inputProps?: any;
  users: IUserDisplay[];
  initialUsers?: string[];
  shrink?: boolean;
  titles?: (_: ILocale) => [string, string];
  width?: string;
  height?: string;
}> = ({
  setFieldValue,
  inputProps = {},
  users: allUsers,
  initialUsers,
  shrink,
  titles = (locale: ILocale) => [
    locale.ui.userSelector.unselected,
    locale.ui.userSelector.selected,
  ],
  width,
  height,
}) => {
  const { locale } = useLocale();

  const initialUsersInner = useMemo(
    () => (initialUsers ? [...initialUsers] : []),
    [initialUsers]
  );

  const [users, setUsers] =
    useState<ICustomTransferListData>(undefined);

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!!!data) return;
      setFieldValue(data[1].map((item) => item.login));
      setUsers(data);
    },
    [setFieldValue]
  );

  useEffect(() => {
    let data: ICustomTransferListData = [[], []];

    for (let i = 0; i < allUsers.length; i++) {
      if (
        initialUsersInner.find((login) => login === allUsers[i].login)
      ) {
        data[1].push({
          ...allUsers[i],
          value: allUsers[i].login,
          sortValue: allUsers[i].login,
        });
      } else {
        data[0].push({
          ...allUsers[i],
          value: allUsers[i].login,
          sortValue: allUsers[i].login,
        });
      }
    }
    setUsers(data);
  }, [allUsers, initialUsersInner]);

  const [displayedField, setDisplayedField] = useState<
    'shortName' | 'login'
  >('shortName');

  const itemComponent: ICustomTransferListItemComponent = useCallback(
    ({ item, onClick, index }) => {
      return (
        <div
          key={index}
          className={`${styles.itemWrapper} ${
            shrink ? inputStyles.shrink : ''
          }`}
        >
          <div className={styles.item} onClick={onClick}>
            {item[displayedField]}
          </div>
          <div className={styles.actions}>
            <Icon
              href={`/profile/${item.login}`}
              target="_blank"
              tabIndex={5}
              color="var(--primary)"
              variant="transparent"
              size="xs"
            >
              <Eye />
            </Icon>
          </div>
        </div>
      );
    },
    [displayedField, shrink]
  );

  return (
    <div>
      <SegmentedControl
        data={[
          {
            label: locale.group.form.login,
            value: 'login',
          },
          {
            label: locale.group.form.shortName,
            value: 'shortName',
          },
        ]}
        value={displayedField}
        onChange={(value) =>
          setDisplayedField(value as 'login' | 'shortName')
        }
      />
      <CustomTransferList
        titles={titles(locale)}
        itemComponent={itemComponent}
        searchKeys={['login', 'name', 'shortName']}
        {...inputProps}
        value={users}
        onChange={onChange}
        width={width}
        height={height}
      />
    </div>
  );
};

export default memo(UserSelector);
