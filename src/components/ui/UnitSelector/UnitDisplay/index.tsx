import { IUnit } from '@custom-types/data/ICourse';
import { ActionIcon, Box, Collapse, Group, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FC, memo } from 'react';
import { CaretDown, CaretRight, Plus, Trash } from 'tabler-icons-react';

const UnitDisplay: FC<{ unit: IUnit }> = ({ unit }) => {
  const [opened, handlers] = useDisclosure(false);
  return (
    <Box ml={'md'}>
      <Group gap={0}>
        <TextInput defaultValue={unit.title} />
        <ActionIcon.Group>
          <ActionIcon variant="outline">
            <Plus />
          </ActionIcon>

          <ActionIcon variant="outline">
            <Trash />
          </ActionIcon>

          {unit.units.length > 0 && (
            <ActionIcon variant="outline" onClick={handlers.toggle}>
              {opened ? <CaretDown /> : <CaretRight />}
            </ActionIcon>
          )}
        </ActionIcon.Group>
      </Group>
      <Collapse in={opened} transitionDuration={100 * unit.units.length}>
        {unit.units.map((item, index) => (
          <UnitDisplay unit={item} key={index} />
        ))}
      </Collapse>
    </Box>
  );
};

export default memo(UnitDisplay);
