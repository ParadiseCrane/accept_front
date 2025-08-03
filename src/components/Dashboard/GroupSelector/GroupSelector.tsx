'use client';

import { useRequest } from '@hooks/useRequest';
import { Icon } from '@ui/basics';
import { FC, useEffect, useState } from 'react';

import styles from './styles.module.css';
import CourseGroupSelector from '@ui/selectors/CourseGroupSelector/CourseGroupSelector';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IGroupBaseInfo } from '@custom-types/data/IGroup';
import { useLocalStorage } from '@mantine/hooks';
import { ICourseGroupPair } from '@custom-types/data/ICourse';
import { IconUsersGroup, IconX } from '@tabler/icons-react';

export const GroupSelector: FC<{ courseSpec: string }> = ({ courseSpec }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [groups, setGroups] = useState<IGroupBaseInfo[]>([]);
  const [currentGroup, setCurrentGroup] = useState<IGroupBaseInfo | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [courseGroupPairLS, setCourseGroupPairLS] = useLocalStorage<
    ICourseGroupPair[]
  >({
    key: 'color-group-list',
    defaultValue: [],
  });

  const { data } = useRequest<{}, any, IGroupBaseInfo[]>(
    `course/groups/${courseSpec}`,
    'GET',
    undefined
  );

  const changeUrl = (groupSpec: string) => {
    if (searchParams) {
      const section = searchParams.get('section');
      if (section) {
        changeParams(section, groupSpec);
      }
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
    if (data && searchParams) {
      setGroups(data);
      if (data.length === 0) {
        changeUrl('all');
      } else {
        const hasGroupUrl =
          searchParams.has('group') && searchParams.get('group') !== 'all';
        if (hasGroupUrl) {
          const group = data.find(
            (item) => item.spec === searchParams.get('group')
          );
          if (group) {
            setGroup(group);
          }
        } else {
          const courseGroupPair = courseGroupPairLS
            .filter((item) => item.courseSpec === courseSpec)
            .pop();
          if (courseGroupPair) {
            const matchedGroup = data.find(
              (item) => item.spec === courseGroupPair.groupSpec
            );
            setGroup(matchedGroup ?? data[0]);
          } else {
            setGroup(data[0]);
          }
        }
      }
    }
  }, [data, searchParams]);

  const changeParams = (section: string, group: string) => {
    if (searchParams) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('section', section);
      params.set('group', group);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className={styles.wrapper + ' ' + (showSelector ? styles.show : '')}>
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
        <Icon size="sm" className={styles.iconRoot}>
          {showSelector ? (
            <IconX color="var(--primary)" />
          ) : (
            <IconUsersGroup color="var(--primary)" />
          )}
        </Icon>
      </div>
    </div>
  );
};
