"use client";
import { useLocale } from "@hooks/useLocale";
import styles from "./Content.module.css";
import { links } from "@constants/MainHeaderLinks";
import { NavLink } from "@mantine/core";
import { useAnalytics } from "@hooks/useAnalytics";

export const Content = () => {
  const { locale } = useLocale();
  const analytics = useAnalytics();

  return (
    <>
      {links.map((e, idx1) => (
        <NavLink
          key={idx1}
          href={e.href}
          label={e.text(locale)}
          classNames={{ label: styles.title }}
        >
          {e.links &&
            e.links.map((e, idx2) => (
              <NavLink
                key={`${idx1}-${idx2}`}
                href={e.href}
                label={e.text(locale)}
                classNames={{ label: styles.title }}
                onClick={() => analytics?.track(e.eventName)}
              />
            ))}
        </NavLink>
      ))}
    </>
  );
};
