import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Center, Title, Box } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { IUnit, IUnitDashboardMain } from '@custom-types/data/ICourse';

const UnitMain: FC<{
  unitProps: IUnit | undefined;
}> = ({ unitProps }) => {
  const [unit, setUnit] = useState<IUnitDashboardMain | undefined>();

  const fetchData = useCallback(async () => {
    if (unitProps) {
      setUnit({
        title: unitProps.title,
        description: unitProps.description,
      });
    }
  }, [unitProps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!unit) return null;

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
