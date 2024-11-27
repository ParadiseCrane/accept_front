import { ICourse } from '@custom-types/data/ICourse';
import { ITask } from '@custom-types/data/ITask';
import { NavLink } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { FC, memo } from 'react';

const NavBlock: FC<{ item: ICourse | ITask }> = ({ item }) => {
  // Is ITask
  if (!('children' in item))
    return <NavLink label={item.title} href={`#${item.spec}`} />;
  // Has no children
  if (item.children.length == 0)
    return <NavLink label={item.title} href={`#${item.spec}`} />;

  const [_hash, setHash] = useHash();

  return (
    <NavLink label={item.title} onClick={() => setHash(item.spec)}>
      {item.children.map((item, index) => (
        <NavBlock key={index} item={item} />
      ))}
    </NavLink>
  );
};

export default memo(NavBlock);
