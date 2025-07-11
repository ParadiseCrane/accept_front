'use client';
import { FC, memo } from 'react';
import { Center, Title, Box } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { IUnit } from '@custom-types/data/ICourse';

const UnitMain: FC<{
  unitProps: IUnit;
}> = ({ unitProps: unit }) => {
  return (
    <>
      <Center mt={'md'} mb={'md'}>
        <Title order={1} ta={'center'} pr={'md'}>
          {unit.title}
        </Title>
      </Center>
      <Box ml={'xl'} mr={'xl'}>
        <TipTapEditor
          editorMode={false}
          content={unit.description}
          onUpdate={() => {}}
        />
      </Box>
    </>
  );
};

export default memo(UnitMain);
