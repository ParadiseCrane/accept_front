import SignIn from '@components/layout/Navbar/SignIn/SignIn';
import { IHeaderLink } from '@custom-types/ui/IHeaderLink';
import { Group } from '@mantine/core';
import { FC, memo } from 'react';

import { HeaderLink } from './HeaderLink';

const Links: FC<{
  links: IHeaderLink[];
}> = ({ links }) => {
  return (
    <div>
      <Group align="center" gap="xl">
        {links.map((link, index) => (
          <HeaderLink key={index} link={link} />
        ))}
        <SignIn />
      </Group>
    </div>
  );
};

export default memo(Links);
