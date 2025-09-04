'use client';
import { IUnit, ILesson, ICourse } from '@custom-types/data/ICourse';
import { AppShell, Box, Center, Title } from '@mantine/core';
import { sendRequest } from '@requests/request';
import { ImageComponent } from '@ui/ImageSelector/ImageComponent/ImageComponent';
import { FC, memo, useEffect, useState } from 'react';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import Lesson from '../Lesson/Lesson';
import { useSearchParams } from 'next/navigation';

import styles from './main.module.css';

// TODO mocked method
const defaultLesson = (lesson: ILesson): ILesson => {
  return {
    ...lesson,
    allowedLanguages: [],
    forbiddenLanguages: [],
  };
};

const Main: FC = () => {
  const [entity, setEntity] = useState<ICourse | IUnit | ILesson | null>(null);
  const searchParams = useSearchParams();
  const spec = searchParams?.get('item');

  useEffect(() => {
    if (spec && entity?.spec !== spec) {
      sendRequest<any, any>(`course/${spec}`, 'GET', undefined, undefined).then(
        (res) => {
          setEntity(
            res.response.kind === 'lesson'
              ? defaultLesson(res.response)
              : (res.response as ICourse | IUnit | ILesson)
          );
        }
      );
    }
  }, [spec, entity]);

  if (!entity || !spec || (spec && entity.spec !== spec)) return null;

  return (
    <AppShell.Main classNames={{ main: styles.main }}>
      <div className={styles.contentWrapper}>
        {'tasks' in entity ? (
          <Lesson lesson={entity} />
        ) : (
          <>
            {entity.kind === 'course' && (
              <ImageComponent
                index={0}
                item={entity.image}
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
                {entity.title}
              </Title>
            </Center>
            <Box ml={'xl'} mr={'xl'}>
              <TipTapEditor
                key={entity.spec}
                editorMode={false}
                content={entity.description}
                onUpdate={() => {}}
              />
            </Box>
          </>
        )}
      </div>
    </AppShell.Main>
  );
};

export default memo(Main);
