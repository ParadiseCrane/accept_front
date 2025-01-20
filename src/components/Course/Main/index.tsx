import { ICourse } from '@custom-types/data/ICourse';
import { ITask } from '@custom-types/data/ITask';
import { useRequest } from '@hooks/useRequest';
import { AppShell, Center, Text, Title } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { sendRequest } from '@requests/request';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
