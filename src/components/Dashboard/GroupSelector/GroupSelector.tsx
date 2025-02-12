import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { Icon } from '@ui/basics';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Users, X } from 'tabler-icons-react';

import styles from './styles.module.css';
import CourseGroupSelector from '@ui/selectors/CourseGroupSelector/CourseGroupSelector';
import { useRouter } from 'next/router';
import { IGroupBaseInfo } from '@custom-types/data/IGroup';
import { useSearchParams } from 'next/navigation';

const initialGroups: IGroupBaseInfo[] = [
  {
    spec: '25',
    name: 'Group 1',
  },
  {
    spec: '34',
    name: 'Group 2',
  },
  {
    spec: '47',
    name: 'Group 3',
  },
  {
    spec: '59',
    name: 'Group 4',
  },
];

const GroupSelector: FC = () => {
  const [showSelector, setShowSelector] = useState(false);
  const [groups, setGroups] = useState<IGroupBaseInfo[]>(initialGroups);
  const [currentGroup, setCurrentGroup] = useState<IGroupBaseInfo | null>(null);
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO поменять на реальный запрос
  const { data, loading, refetch } = useRequest<{}, any, any>(
    '/course',
    'GET',
    undefined
  );

  useEffect(() => {
    // TODO поменять на реальные данные
    setCurrentGroup(initialGroups[0]);
    changeCurrentGroup(initialGroups[0]);
  }, [data]);

  const changeCurrentGroup = (item: IGroupBaseInfo) => {
    setCurrentGroup(item);
    if (searchParams.has('section')) {
      changeParams(searchParams.get('section')!, item.spec);
    }
  };

  const changeParams = (section: string, group: string) => {
    const regExp = /\[.*?\]/g;
    let pathName = router.pathname;
    const list = pathName.match(regExp);
    if (list) {
      for (let i = 0; i < list.length; i++) {
        const variableName = list[i].replace('[', '').replace(']', '');
        const value = router.query[variableName];
        pathName = pathName.replace(`[${variableName}]`, `${value}`);
      }
    }
    const newPathObject = {
      pathname: pathName,
      query: { section: section, group: group },
    };
    router.push(newPathObject, undefined, { shallow: true });
  };

  return (
    <>
      {/* {!loading && data && !data.infinite && ( */}
      {
        <div
          className={styles.wrapper + ' ' + (showSelector ? styles.show : '')}
        >
          <div className={styles.selectorWrapper}>
            <div className={styles.selector}>
              <CourseGroupSelector
                label={''}
                groups={groups}
                currentGroup={currentGroup}
                select={(item: IGroupBaseInfo) => {
                  changeCurrentGroup(item);
                }}
              />
            </div>
          </div>
          <Icon
            size={'sm'}
            className={styles.iconRoot}
            wrapperClassName={styles.iconWrapper}
            onClick={() => {
              setShowSelector((value) => !value);
            }}
          >
            {showSelector ? (
              <X color={'var(--primary)'} />
            ) : (
              <Users color={'var(--primary)'} />
            )}
          </Icon>
        </div>
      }
    </>
  );
};

export default memo(GroupSelector);
