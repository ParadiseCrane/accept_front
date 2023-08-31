import React, { FC } from 'react';
import { IHeaderLink } from '@custom-types/ui/IHeaderLink';
import { useLocale } from '@hooks/useLocale';
import Dropdown from './Dropdown';
import { accessLevels } from '@constants/protectedRoutes';
import linkStyles from '@styles/ui/link.module.css';
import { useUser } from '@hooks/useUser';
import Link from 'next/link';
import { Button } from '@ui/basics';

export const HeaderLink: FC<{
  link: IHeaderLink;
  additionalClass?: string;
}> = ({ link, additionalClass }) => {
  const { locale } = useLocale();

  const { accessLevel } = useUser();
  return (
    <div className={additionalClass}>
      {link.type == 'dropdown' && link.links ? (
        <Dropdown
          items={link.links
            .filter(
              (item) =>
                !item.permission ||
                accessLevel >= accessLevels[item.permission]
            )
            .map((dropdownLink) => ({
              href: dropdownLink.href,
              label: dropdownLink.text(locale),
            }))}
          transition={'scale-y'}
          transitionDuration={link.links.length * 50}
        >
          <Button kind="header">{link.text(locale)}</Button>
        </Dropdown>
      ) : (
        (!link.permission ||
          accessLevel >= accessLevels[link.permission]) && (
          <Link href={link.href} className={linkStyles.headerLink}>
            {link.text(locale)}
          </Link>
        )
      )}
    </div>
  );
};
