import { ICourse } from '@custom-types/data/ICourse';
import { ITask } from '@custom-types/data/ITask';
import { AppShell, Center, Title, Image, Box } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { sendRequest } from '@requests/request';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { FC, memo, useEffect, useState } from 'react';

const Main: FC = () => {
  const [course, setCourse] = useState<ICourse | ITask | null>(null);
  const [hash] = useHash();

  useEffect(() => {
    if (!hash.includes('#')) {
      return;
    }

    const spec = hash.split('#').pop()!;
    sendRequest<any, any>(`course/${spec}`, 'GET', undefined, undefined).then(
      (res) => {
        setCourse(res.response as ICourse | ITask);
      }
    );
  }, [hash]);

  if (!course) {
    return <div>Loading</div>;
  }

  if (!('children' in course)) return <div>task</div>;
  return (
    <AppShell.Main>
      {course.image.length > 0 && (
        <Image
          src={`/api/image/${course.image}`}
          alt="Picture of the course"
          width={600}
          height={200}
          radius={'md'}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: 200,
            objectFit: 'cover',
          }}
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
