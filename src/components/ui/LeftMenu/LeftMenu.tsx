"use client";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { Box, NavLink, Tabs } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, ReactNode, memo, useCallback } from "react";
import styles from "./leftMenu.module.css";

interface ILeftMenuProps {
  links: IMenuLink[];
  topContent?: ReactNode;
  children?: ReactNode;
}

const LeftMenu: FC<ILeftMenuProps> = ({ links, topContent, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSection = searchParams?.get("section") || links[0]?.section;

  const changeParams = useCallback(
    (section: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("section", section);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <>
      <div className={styles.tabletWrapper}>
        <Tabs
          value={currentSection}
          onChange={(value) => value && changeParams(value)}
        >
          <Tabs.List grow justify="center">
            {links.map((e) => (
              <Tabs.Tab value={e.section ?? ""} key={e.section}>
                <NavLink label={e.title} leftSection={e.icon} component="div" />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
        <div className={styles.pageWrapper}>{children}</div>
      </div>

      <div className={styles.wrapper}>
        <Box p="xs" w={300}>
          {topContent && <div className={styles.topContent}>{topContent}</div>}
          <div className={styles.navLinks}>
            {links.map((element) => (
              <NavLink
                key={element.section}
                active={element.section === currentSection}
                onClick={() => changeParams(element.section!)}
                label={element.title}
                leftSection={element.icon}
              />
            ))}
          </div>
        </Box>
        <div className={styles.pageWrapper}>{children}</div>
      </div>
    </>
  );
};

export default memo(LeftMenu);
