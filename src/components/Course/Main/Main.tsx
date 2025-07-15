'use client';
import { IUnit, ILesson, ICourse } from '@custom-types/data/ICourse';
import { AppShell, Box, Center, Title } from '@mantine/core';
import { sendRequest } from '@requests/request';
import { ImageComponent } from '@ui/ImageSelector/ImageComponent/ImageComponent';
import { FC, memo, useEffect, useState } from 'react';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import Lesson from '../Lesson/Lesson';
import { useCourse } from '@hooks/useCourse';

// TODO mocked method
const defaultLesson = ({
  spec,
  title,
  desc,
}: {
  spec: string;
  title: string;
  desc: string;
}): ILesson => {
  return {
    kind: 'lesson',
    children: [],
    tasks: [
      {
        spec: '1516a6df-2eca-4d9d-8705-395d2d5f3a1d',
        organization: 'public',
        title: 'Максимальная и минимальная цифра числа',
        author: 'avu',
        tags: [
          {
            spec: 'f5c053b7-d3af-473a-bf5e-7edc3c905ace',
            organization: 'public',
            title: 'Задачи ВМЛ',
            predefined: true,
          },
          {
            spec: '9bbad80f-216f-4f22-8ade-dfdcfe02bd3a',
            organization: 'public',
            title: 'Цикл с условием',
            predefined: true,
          },
        ],
        verdict: {
          spec: 2,
          fullText: 'Wrong Answer',
          shortText: 'WA',
        },
        insertedDate: new Date('2022-12-24T11:18:16.885000'),
        complexity: 58,
      },
    ],
    allowedLanguages: [],
    forbiddenLanguages: [],
    spec: spec,
    title: title,
    description: desc,
  };
};

const Main: FC = () => {
  const [entity, setEntity] = useState<ICourse | IUnit | ILesson | null>(null);
  const { item } = useCourse();

  useEffect(() => {
    if (item && entity?.spec !== item) {
      sendRequest<any, any>(`course/${item}`, 'GET', undefined, undefined).then(
        (res) => {
          setEntity(
            res.response.kind === 'lesson'
              ? defaultLesson({
                  spec: res.response.spec as string,
                  desc: res.response.description as string,
                  title: res.response.title as string,
                })
              : (res.response as ICourse | IUnit | ILesson)
          );
        }
      );
    }
  }, [item, entity]);

  if (!entity) return null;

  return (
    <AppShell.Main>
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
    </AppShell.Main>
  );
};

export default memo(Main);
