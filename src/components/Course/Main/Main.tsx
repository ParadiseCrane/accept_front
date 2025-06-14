import { IUnit, ILesson, ICourse } from '@custom-types/data/ICourse';
import { AppShell, Box, Center, Title } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { sendRequest } from '@requests/request';
import { ImageComponent } from '@ui/ImageSelector/ImageComponent/ImageComponent';
import { FC, memo, useEffect, useState } from 'react';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import Lesson from '../Lesson/Lesson';

const Main: FC = () => {
  const [course, setCourse] = useState<ICourse | IUnit | ILesson | null>(null);
  const [hash] = useHash();

  useEffect(() => {
    if (!hash.includes('#')) {
      return;
    }

    const spec = hash.split('#').pop()!;
    sendRequest<any, any>(`course/${spec}`, 'GET', undefined, undefined).then(
      (res) => {
        setCourse(res.response as ICourse | IUnit | ILesson);
      }
    );
  }, [hash]);

  if (!course) {
    return <div>Loading</div>;
  }

  if (!('children' in course)) return <Lesson lesson={course} />;

  return (
    <AppShell.Main>
      {course.kind === 'course' && (
        <ImageComponent
          index={0}
          item={course.image}
          active={false}
          animate
          height={240}
          radius="md"
          imageStyle={{
            width: '100%',
            height: 'auto',
            maxHeight: 240,
            objectFit: 'cover',
          }}
          cover
        />
      )}
      <Center mt={'md'} mb={'md'}>
        <Title order={1} ta={'center'}>
          {course.title}
        </Title>
      </Center>
      <Box ml={'xl'} mr={'xl'}>
        <TipTapEditor
          editorMode={false}
          content={course.description}
          onUpdate={() => {}}
        />
      </Box>
    </AppShell.Main>
  );
};

export default memo(Main);
