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
import { useLocalStorage } from '@mantine/hooks';
import { ICourseGroupPair } from '@custom-types/data/ICourse';

const GroupSelector: FC<{ courseSpec: string }> = ({ courseSpec }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [groups, setGroups] = useState<IGroupBaseInfo[]>([]);
  const [currentGroup, setCurrentGroup] = useState<IGroupBaseInfo | null>(null);
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courseGroupPairLS, setCourseGroupPairLS] = useLocalStorage<
    ICourseGroupPair[]
  >({
    key: 'color-group-list',
    defaultValue: [],
  });

  // TODO поменять на реальный запрос
  const { data, loading, refetch } = useRequest<{}, any, IGroupBaseInfo[]>(
    `/course/group/${courseSpec}`,
    'GET',
    undefined
  );

  const changeUrl = (groupSpec: string) => {
    if (searchParams.has('section')) {
      changeParams(searchParams.get('section')!, groupSpec);
    }
  };

  const setGroup = (group: IGroupBaseInfo) => {
    setCurrentGroup(group);
    changeUrl(group.spec);
    setCourseGroupPairLS((prev) => [
      ...prev,
      { courseSpec, groupSpec: group.spec },
    ]);
  };

  useEffect(() => {
    // TODO поменять на реальные данные
    if (data) {
      setGroups(data);
      if (data.length > 0) {
        const hasGroupUrl =
          searchParams.has('group') && searchParams.get('group') !== 'all';
        if (hasGroupUrl) {
          const group = data.filter(
            (item) => item.spec === searchParams.get('group')
          )[0];
          setGroup(group);
        } else {
          const courseGroupPair = courseGroupPairLS
            .filter((item) => item.courseSpec == courseSpec)
            .pop();
          if (courseGroupPair) {
            const groups = data.filter(
              (item) => item.spec === courseGroupPair.groupSpec
            );
            if (groups.length > 0) {
              setGroup(groups[0]);
            } else {
              setGroup(data[0]);
            }
          } else {
            setGroup(data[0]);
          }
        }
      } else {
        changeUrl('all');
      }
    }
  }, [data]);

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
                groups={groups}
                currentGroup={currentGroup}
                select={(item: IGroupBaseInfo) => {
                  setGroup(item);
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
