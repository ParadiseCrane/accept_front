import { Affix } from '@mantine/core';
import { FC, ReactNode, memo } from 'react';
import { pureCallback } from '@custom-types/ui/atomic';
import ActionButton from './ActionButton/ActionButton';

type positions = {
  bottom: number;
  right: number;
};

const SingularSticky: FC<{
  icon: ReactNode;
  color?: string;
  onClick?: pureCallback;
  href?: string;
  position?: positions;
  description: string;
  classNames?: any;
}> = ({ icon, position, color, description, classNames, onClick, href }) => {
  return (
    <>
      <Affix
        position={{
          bottom: position?.bottom || 20,
          right: position?.right || 20,
        }}
        zIndex={199}
      >
        <ActionButton
          action={{
            icon: icon,
            color: color || 'var(--positive)',
            onClick: onClick,
            href: href,
            description: description,
          }}
        />
      </Affix>
    </>
  );
};

export default memo(SingularSticky);
