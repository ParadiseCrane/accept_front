import {
  ICourseModel,
  IGroupOpenness,
  IUnit,
} from '@custom-types/data/ICourse';
import { sendRequest } from '@requests/request';
import { LoadingOverlay } from '@ui/basics';
import { useSearchParams } from 'next/navigation';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import GroupOpennessTree from './GroupOpennessTree/GroupOpennessTree';

const GroupOpenness: FC<{ spec: string }> = ({ spec }) => {
  const [course, setCourse] = useState<ICourseModel | null>(null);
  const [groupOpennessList, setGroupOpennessList] = useState<
    IGroupOpenness[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (params.get('group') && params.get('group') !== 'all') {
      const groupOpennessListResponse = await sendRequest<{}, IGroupOpenness[]>(
        `course/course_openness_list/${spec}/${params.get('group')}`,
        'GET'
      );
      const courseNavigationTreeResponse = await sendRequest<{}, ICourseModel>(
        `course/course_navigation_tree/${spec}`,
        'GET'
      );
      if (
        !groupOpennessListResponse.error &&
        !courseNavigationTreeResponse.error
      ) {
        setCourse({
          ...courseNavigationTreeResponse.response,
          spec: spec,
        });
        setGroupOpennessList(groupOpennessListResponse.response);
      }
    }
    setLoading(false);
  }, [spec, params]);

  const toggleGroupOpennessList = useCallback(async (spec: string) => {
    setLoading(true);
    const response = await sendRequest<{}, IGroupOpenness[]>(
      `course/toggle_group_openness/${spec}/${params.get('group')}`,
      'PUT'
    );
    if (!response.error) {
      setGroupOpennessList(response.response);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [spec, params]);

  if (!course || !groupOpennessList || loading)
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <LoadingOverlay
          visible={!course || !groupOpennessList || loading}
          loaderProps={{ radius: 'lg' }}
        />
      </div>
    );

  if (params && params.get('group') && params.get('group') === 'all') {
    // TODO добавить надпись, что группа не выбрана
    return null;
  }

  return (
    <GroupOpennessTree
      course={course}
      groupOpennessList={groupOpennessList}
      toggleGroupOpennessList={toggleGroupOpennessList}
    />
  );
};

export default memo(GroupOpenness);
