"use client";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { Box, NavLink, Tabs } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, ReactNode, memo, useCallback, useEffect, useRef } from "react";
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
  const activeValue = searchParams?.get("section");
  const retryCount = useRef(0);

  const updateUrl = useCallback(
    (section: string, mode: "push" | "replace" = "replace") => {
      const params = new URLSearchParams(searchParams?.toString() || "");

      if (params.get("section") === section) return;

      params.set("section", section);
      const url = `${pathname}?${params.toString()}`;

      if (mode === "push") {
        router.push(url, { scroll: false });
      } else {
        router.replace(url, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (!links || links.length === 0) return;

    if (searchParams) {
      const currentSection = searchParams.get("section");
      if (currentSection === null) {
        if (retryCount.current !== 0) {
          updateUrl(links[0].section, "replace");
        }
        retryCount.current = retryCount.current + 1;
        return;
      }
      const isValid = links.some((link) => link.section === currentSection);
      if (!isValid) {
        updateUrl(links[0].section, "replace");
        return;
      }
    }
  }, [links.length, searchParams, updateUrl]);

  return (
    <>
      <div className={styles.tabletWrapper}>
        <Tabs
          value={activeValue}
          onChange={(value) => {
            value && updateUrl(value, "push");
          }}
        >
          <Tabs.List grow justify="center">
            {links.map((e) => (
              <Tabs.Tab value={e.section ?? ""} key={e.section}>
                <NavLink
                  label={e.title}
                  leftSection={e.icon}
                  component="div"
                  p={0} // Убираем падинги, так как NavLink внутри Tab
                />
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
                active={element.section === activeValue}
                onClick={() => {
                  updateUrl(element.section!, "push");
                }}
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
