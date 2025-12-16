"use client";
import { useLocale } from "@hooks/useLocale";
import styles from "./Content.module.css";
import { links } from "@constants/MainHeaderLinks";
import { NavLink } from "@mantine/core";

export const Content = () => {
  const { locale } = useLocale();
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
              />
            ))}
        </NavLink>
      ))}
    </>
  );
};
