import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Center, Title, Image, Skeleton, Box, Paper } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { ILesson, ILessonDashboardMain } from '@custom-types/data/ICourse';
import { useSearchParams } from 'next/navigation';
import { sendRequest } from '@requests/request';
import { IGroupInvite } from '@custom-types/data/IGroup';
import { LinkCopy } from '@ui/LinkCopy/LinkCopy';
import { useLocale } from '@hooks/useLocale';

const LessonMain: FC<{
  lessonProps: ILesson | undefined;
}> = ({ lessonProps }) => {
  const [lesson, setLesson] = useState<ILessonDashboardMain | undefined>();
  const { locale } = useLocale();

  const fetchData = useCallback(async () => {
    if (lessonProps) {
      setLesson({
        title: lessonProps.title,
        description: lessonProps.description,
      });
    }
  }, [lessonProps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!lesson) return null;

  return (
    <>
      <Center mt={'md'} mb={'md'}>
        <Title order={1} ta={'center'}>
          {lesson.title}
        </Title>
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
