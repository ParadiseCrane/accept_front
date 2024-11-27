import { IUnit } from '@custom-types/data/ICourse';
import { Accordion, Stack, Text } from '@mantine/core';
import { FC, memo } from 'react';

const UnitDisplay: FC<{ unit: IUnit }> = ({ unit }) => {
  return (
    <Accordion.Item value={unit.id} key={unit.title}>
      <Accordion.Control>
        <Text>{unit.title}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        {unit.units.map((item, index) => (
          <UnitDisplay unit={item} key={index} />
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default memo(UnitDisplay);
