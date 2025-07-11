'use client';

import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Button } from '@ui/basics';
import ProfileMenu from '@ui/ProfileMenu/ProfileMenu';
import { useRouter, usePathname } from 'next/navigation';
import { FC } from 'react';

const SignIn: FC<{ size?: 'md' | 'lg' }> = ({ size = 'lg' }) => {
  const { locale } = useLocale();
  const router = useRouter();
  const path = usePathname();
  const { user } = useUser();

  return (
    <>
      {!user ? (
        <Button
          kind="header"
          onClick={() => router.push(`/signin?referrer=${path}`)}
        >
          {locale.mainHeaderLinks.signIn}
        </Button>
      ) : (
        <ProfileMenu size={size} />
      )}
    </>
  );
};

export default SignIn;
