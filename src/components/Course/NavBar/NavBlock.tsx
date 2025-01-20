import { ICourse, IUnit } from '@custom-types/data/ICourse';
import { ITask } from '@custom-types/data/ITask';
import { NavLink } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { FC, memo } from 'react';

const NavBlock: FC<{ unit: IUnit }> = ({ unit }) => {
  const [hash, setHash] = useHash();

  return <NavLink label={unit.title} onClick={() => setHash(unit.spec)} />;
};

export default memo(NavBlock);
