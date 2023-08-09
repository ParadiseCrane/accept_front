import { FC, Fragment, useState } from 'react';
import { IHeaderLink } from '@custom-types/ui/IHeaderLink';
import { HeaderLink } from '../Header/Links/HeaderLink';
import { useLocale } from '@hooks/useLocale';
import styles from './sideBar.module.css';
import { Burger, Stack } from '@mantine/core';
import SignIn from '../SignIn/SignIn';
import { pureCallback } from '@custom-types/ui/atomic';

export const Links: FC<{
  links: IHeaderLink[];
  dropdownLinks: IHeaderLink[];
  dropdownLabel: string;
  onClose: pureCallback<void>;
}> = ({ links, dropdownLinks, dropdownLabel, onClose }) => {
  const [openCollapse, setOpenCollapse] = useState(false);

  const { locale } = useLocale();

  return (
    <>
      <Burger
        className={styles.burger}
        opened={true}
        onClick={onClose}
      />
      <Stack align="flex-start" className={styles.linkWrapper}>
        <SignIn />
        {links.map((link, index) => (
          <Fragment key={index}>
            {link.text(locale) == 'dropdown' ? (
              <>
                <div
                  className={styles.linkDiv}
                  onClick={() => setOpenCollapse((open) => !open)}
                >
                  {dropdownLabel}
                </div>
                <div
                  className={styles.collapse}
                  style={{ display: openCollapse ? 'block' : 'none' }}
                >
                  {dropdownLinks &&
                    dropdownLinks.map((link, index) => (
                      <Fragment key={index}>
                        <div
                          style={{ margin: 'var(--spacer-l) 10%' }}
                        >
                          <HeaderLink
                            link={link}
                            additionalClass={styles.noHoverLink}
                          />
                        </div>
                      </Fragment>
                    ))}
                </div>
              </>
            ) : (
              <HeaderLink
                link={link}
                additionalClass={styles.noHoverLink}
              />
            )}
          </Fragment>
        ))}
      </Stack>
    </>
  );
};
