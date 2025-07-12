'use client';
import { useRequest } from '@hooks/useRequest';
import { Icon } from '@ui/basics';
import { FC, useCallback, useEffect, useState } from 'react';

import styles from './styles.module.css';
import CourseGroupSelector from '@ui/selectors/CourseGroupSelector/CourseGroupSelector';
import { IGroupBaseInfo } from '@custom-types/data/IGroup';
import {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
} from 'next/navigation';
import { useLocalStorage } from '@mantine/hooks';
import { ICourseGroupPair } from '@custom-types/data/ICourse';
import { IconUsersGroup, IconX } from '@tabler/icons-react';
import { IResponse } from '@requests/request';

const GroupSelector: FC<{ courseSpec: string }> = ({ courseSpec }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [groups, setGroups] = useState<IGroupBaseInfo[]>([]);
  const [currentGroup, setCurrentGroup] = useState<IGroupBaseInfo | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [courseGroupPairLS, setCourseGroupPairLS] = useLocalStorage<
    ICourseGroupPair[]
  >({
    key: 'color-group-list',
    defaultValue: [],
  });

  const _ = useRequest<undefined, IGroupBaseInfo[]>(
    `course/groups/${courseSpec}`,
    'GET',
    undefined,
    undefined,
    (response: IResponse<IGroupBaseInfo[]>) => {
      const data = response.response;
      setGroups(data);
      if (data.length === 0) {
        changeUrl('all');
      } else {
        const hasGroupUrl =
          searchParams &&
          searchParams.has('group') &&
          searchParams.get('group') !== 'all';
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
  );

  const changeParams = useCallback(
    (section: string, group: string) => {
      if (searchParams) {
        const old_group = searchParams.get('group');
        const old_section = searchParams.get('section');
        if (old_group == group && old_section == section) {
          return;
        }
      }
      let params = new URLSearchParams(searchParams?.toString());
      params.set('group', group);
      params.set('section', section);
      router.push(pathName + '?' + params.toString());
    },
    [router, searchParams, pathName]
  );

  const changeUrl = useCallback(
    (groupSpec: string) => {
      if (searchParams && searchParams.has('section')) {
        changeParams(searchParams.get('section')!, groupSpec);
      }
    },
    [searchParams, changeParams]
  );

  const setGroup = useCallback(
    (group: IGroupBaseInfo) => {
      setCurrentGroup(group);
      changeUrl(group.spec);
      setCourseGroupPairLS((prev) => [
        ...prev,
        { courseSpec, groupSpec: group.spec },
      ]);
    },
    [changeUrl, courseSpec, setCourseGroupPairLS]
  );

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
        <Icon size={'sm'} className={styles.iconRoot}>
          {showSelector ? (
            <IconX color={'var(--primary)'} />
          ) : (
            <IconUsersGroup color={'var(--primary)'} />
          )}
        </Icon>
      </div>
    </div>
  );
};

export default GroupSelector;
