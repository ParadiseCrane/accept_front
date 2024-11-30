import { ActionIcon, Group, TextInput } from '@mantine/core';
import { FC, memo, useMemo } from 'react';
import UnitDisplay from './UnitDisplay';
import { IUnit } from '@custom-types/data/ICourse';
import { InputWrapper } from '@ui/basics';
import { Plus } from 'tabler-icons-react';

const UnitSelector: FC<{ title_props: any; initial_units: IUnit[] }> = ({
  title_props,
  initial_units,
}) => {
  const units = useMemo(() => [...initial_units], [initial_units]);
  return (
    <InputWrapper label={'Название'}>
      <Group gap={0}>
        <TextInput {...title_props} />
        <ActionIcon kind="positive" variant="outline">
          <Plus />
        </ActionIcon>
      </Group>
      {units.map((unit, index) => (
        <UnitDisplay key={index} unit={unit} />
      ))}
    </InputWrapper>
  );
};

export default memo(UnitSelector);
