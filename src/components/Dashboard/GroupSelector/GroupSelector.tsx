import { useRequest } from '@hooks/useRequest';
import { Icon } from '@ui/basics';
import { FC, memo, useEffect, useState } from 'react';

import styles from './styles.module.css';
import CourseGroupSelector from '@ui/selectors/CourseGroupSelector/CourseGroupSelector';
import { useRouter } from 'next/router';
import { IGroupBaseInfo } from '@custom-types/data/IGroup';
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from '@mantine/hooks';
import { ICourseGroupPair } from '@custom-types/data/ICourse';
import { IconUsersGroup, IconX } from '@tabler/icons-react';

const GroupSelector: FC<{ courseSpec: string }> = ({ courseSpec }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [groups, setGroups] = useState<IGroupBaseInfo[]>([]);
  const [currentGroup, setCurrentGroup] = useState<IGroupBaseInfo | null>(null);
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
    `/course/groups/${courseSpec}`,
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
    if (data) {
      setGroups(data);
      if (data.length === 0) {
        changeUrl('all');
      } else {
        const hasGroupUrl =
          searchParams.has('group') && searchParams.get('group') !== 'all';
        if (hasGroupUrl) {
          const group = data.filter(
            (item) => item.spec === searchParams.get('group')
          );
          if (group.length > 0) {
            setGroup(group[0]);
          }
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
          <div
            className={styles.iconWrapper}
            onClick={() => {
              setShowSelector((value) => !value);
            }}
          >
            <Icon size={'sm'} className={styles.iconRoot}>
              {showSelector ? (
                <IconX color={'var(--primary)'} />
              ) : (
                <IconUsersGroup color={'var(--primary)'} />
              )}
            </Icon>
          </div>
        </div>
      }
    </>
  );
};

export default memo(GroupSelector);
