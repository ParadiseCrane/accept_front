import { ICourse } from '@custom-types/data/ICourse';
import { ITask } from '@custom-types/data/ITask';
import { AppShell, Center, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { FC, memo } from 'react';

const Main: FC<{ course: ICourse | ITask }> = ({ course }) => {
  if (!('children' in course)) return <div>task</div>;
  return (
    <AppShell.Main>
      {course.image.length > 0 && (
        <Image
          src={course.image}
          alt="Picture of the course"
          width={600}
          height={200}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: 200,
            objectFit: 'cover',
          }}
          priority={true}
        />
      )}
      <Center>
        <Title order={1}>{course.title}</Title>
      </Center>
      <Text>{course.description}</Text>
    </AppShell.Main>
  );
};

export default memo(Main);
