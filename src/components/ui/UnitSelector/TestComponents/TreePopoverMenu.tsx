import { Popover } from '@mantine/core';
import { ReactNode, useState } from 'react';

export const TreePopoverMenu = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Popover position="bottom-start" withArrow shadow="md">
      <Popover.Target>{icon}</Popover.Target>
      <Popover.Dropdown>{children}</Popover.Dropdown>
    </Popover>
  );
};
