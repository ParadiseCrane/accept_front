import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Button } from '@ui/basics';
import { UserSelector } from '@ui/selectors';
import { FC, memo, useCallback, useMemo } from 'react';
import styles from './courseMain.module.css';
import { AppShell, Center, Title, Image } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { useRequest } from '@hooks/useRequest';
import { ICourseMain } from '@custom-types/data/ICourse';

const CourseMain: FC<{ spec: string }> = ({ spec }) => {
  const { data, loading } = useRequest<{}, ICourseMain>(
    `course/main/${spec}`,
    'GET',
    undefined
  );

  if (!data || loading) {
    return <div></div>;
  }

  return (
    <>
      {data.image.length > 0 && (
        <Image
          src={`/api/image/${data.image}`}
          alt="Picture of the course"
          width={600}
          height={200}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: 200,
            objectFit: 'cover',
          }}
        />
      )}
      <Center>
        <Title order={1}>{data.title}</Title>
      </Center>
      <a href={data.invite}>{data.invite}</a>
      <TipTapEditor
        editorMode={false}
        content={data.description}
        onUpdate={() => {}}
      />
    </>
  );
};

export default memo(CourseMain);
