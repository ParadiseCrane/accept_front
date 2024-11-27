import { Accordion, Box } from '@mantine/core';
import { FC, memo, useMemo } from 'react';
import UnitDisplay from './UnitDisplay';
import { IUnit } from '@custom-types/data/ICourse';

const UnitSelector: FC<{ initial_units: IUnit[] }> = ({ initial_units }) => {
  const units = useMemo(() => [...initial_units], [initial_units]);
  return (
    <Box>
      <Accordion variant="separated">
        {units.map((unit, index) => (
          <UnitDisplay key={index} unit={unit} />
        ))}
      </Accordion>
    </Box>
  );
};

export default memo(UnitSelector);
