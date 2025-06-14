import { ILesson } from '@custom-types/data/ICourse';
import { AppShell } from '@mantine/core';
import { FC, memo } from 'react';

interface Props {
  lesson: ILesson;
}

const Lesson: FC<Props> = ({ lesson }) => {
  return <AppShell.Main>text</AppShell.Main>;
};

export default memo(Lesson);
