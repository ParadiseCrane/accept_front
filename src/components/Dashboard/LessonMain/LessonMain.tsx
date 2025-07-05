import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Center, Title, Box } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { IGroupOpenness, ILesson } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useSearchParams } from 'next/navigation';
import { sendRequest } from '@requests/request';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { Tip } from '@ui/basics';
import { IconLock, IconLockOff, IconLockOpen } from '@tabler/icons-react';

const LessonMain: FC<{
  lessonProps: ILesson;
}> = ({ lessonProps: lesson }) => {
  const [isOpenForGroups, setIsOpenForGroups] = useState(false);
  const [groupSpec, setGroupSpec] = useState<string | undefined>(undefined);
  const { locale } = useLocale();
  const params = useSearchParams();

  const sendGroupOpenness = useCallback(async () => {
    if (groupSpec && groupSpec !== 'all') {
      const prevState = isOpenForGroups;
      console.log('prevState', prevState);
      setIsOpenForGroups((prev) => !prev);
      await sendRequest<{}, IGroupOpenness[]>(
        `course/toggle_group_openness/${lesson.spec}/${groupSpec}`,
        'PUT'
      ).catch(() => {
        setIsOpenForGroups(prevState);
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.dashboard.course.groupOpennessRequestFail,
          autoClose: 5000,
        });
      });
    }
  }, [groupSpec, locale, lesson, isOpenForGroups]);

  const getGroupOpenness = useCallback(async () => {
    if (params) {
      setGroupSpec(params.get('group') ?? '');
      console.log('params', params.get('group'));
      const groupOpennessListResponse = await sendRequest<{}, IGroupOpenness[]>(
        `course/course_openness_list/${lesson.spec}/${params.get('group')}`,
        'GET'
      );
      if (!groupOpennessListResponse.error) {
        const foundGroup = groupOpennessListResponse.response.find(
          (groupOpenness) => groupOpenness.spec === lesson.spec
        );
        if (foundGroup) {
          setIsOpenForGroups(foundGroup.opened);
        }
      }
    }
  }, [params, lesson]);

  useEffect(() => {
    getGroupOpenness();
  }, [getGroupOpenness]);

  const chooseGroup = !groupSpec || groupSpec === 'all';

  return (
    <>
      <Center mt={'md'} mb={'md'}>
        <Title order={1} ta={'center'}>
          {lesson.title}
        </Title>
        <Tip
          label={
            chooseGroup
              ? locale.dashboard.course.chooseGroup
              : isOpenForGroups
                ? locale.dashboard.course.lesson.closeLesson
                : locale.dashboard.course.lesson.openLesson
          }
          centerContent={true}
          onClick={chooseGroup ? undefined : sendGroupOpenness}
        >
          {chooseGroup ? (
            <IconLockOff color="var(--secondary)" />
          ) : isOpenForGroups ? (
            <IconLockOpen color="var(--secondary)" />
          ) : (
            <IconLock color="var(--secondary)" />
          )}
        </Tip>
      </Center>
      <Box ml={'xl'} mr={'xl'}>
        <TipTapEditor
          editorMode={false}
          content={lesson.description}
          onUpdate={() => {}}
        />
      </Box>
    </>
  );
};

export default memo(LessonMain);
