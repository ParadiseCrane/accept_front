"use client";
import { accessLevels } from "@constants/protectedRoutes";
import { IHeaderLink } from "@custom-types/ui/IHeaderLink";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import linkStyles from "@styles/ui/link.module.css";
import { Button } from "@ui/basics";
import Link from "next/link";
import { FC } from "react";

import Dropdown from "./Dropdown";
import { useAnalytics } from "@hooks/useAnalytics";

export const HeaderLink: FC<{
  link: IHeaderLink;
  additionalClass?: string;
}> = ({ link, additionalClass }) => {
  const { locale } = useLocale();
  const analytics = useAnalytics();

  const { accessLevel } = useUser();
  return (
    <div className={additionalClass}>
      {link.type == "dropdown" && link.links ? (
        <Dropdown
          items={link.links
            .filter(
              (item) =>
                !item.permission ||
                accessLevel >= accessLevels[item.permission],
            )
            .map((dropdownLink) => ({
              href: dropdownLink.href,
              label: dropdownLink.text(locale),
              eventName: dropdownLink.eventName,
            }))}
          transition={"scale-y"}
          transitionDuration={link.links.length * 50}
        >
          <Button kind="header">{link.text(locale)}</Button>
        </Dropdown>
      ) : (
        (!link.permission || accessLevel >= accessLevels[link.permission]) && (
          <Link
            href={link.href}
            className={linkStyles.headerLink}
            onClick={() => analytics?.track(link.eventName)}
          >
            {link.text(locale)}
          </Link>
        )
      )}
    </div>
  );
};
