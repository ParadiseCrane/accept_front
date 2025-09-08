'use client';

import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Button } from '@ui/basics';
import ProfileMenu from '@ui/ProfileMenu/ProfileMenu';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

const SignIn: FC<{ size?: 'md' | 'lg' }> = ({ size = 'lg' }) => {
  const { locale } = useLocale();
  const path = usePathname();
  const { user } = useUser();

  return (
    <>
      {!user ? (
        <Button kind="header" href={`/signin?referrer=${path}`}>
          {locale.mainHeaderLinks.signIn}
        </Button>
      ) : (
        <ProfileMenu size={size} />
      )}
    </>
  );
};

export default SignIn;
