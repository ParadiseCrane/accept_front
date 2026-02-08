"use client";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { Box, NavLink, Tabs } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, ReactNode, memo, useCallback, useEffect, useState } from "react";
import styles from "./leftMenu.module.css";

const LeftMenu: FC<{
  links: IMenuLink[];
  initialStep?: number;
  topContent?: ReactNode;
}> = ({ links, topContent }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams?.get("section");
  const [initialLoad, setInitialLoad] = useState(true);
  const [sectionState, setSectionState] = useState<string | null>(
    () => currentSection ?? null,
  );

  const displayPage = useCallback(() => {
    if (currentSection) {
      const matchingLink = links.find(
        (element) => element.section === currentSection,
      );
      return matchingLink ? matchingLink.page : links[0].page;
    }
    return links[0].page;
  }, [links, currentSection]);

  const changeParams = useCallback(
    (section: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("section", section);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (initialLoad) {
      if (currentSection) {
        changeParams(currentSection);
      } else {
        changeParams(links[0].section!);
      }
      setInitialLoad(false);
    }
  }, [changeParams, currentSection, initialLoad, links]);

  useEffect(() => {
    setSectionState((prev) => {
      if (currentSection && currentSection !== prev) {
        return currentSection;
      }
      return prev;
    });
  }, [currentSection]);

  return (
    <>
      <div className={styles.tabletWrapper}>
        <Tabs value={currentSection}>
          <Tabs.List grow justify="center">
            {links.map((e, idx) => {
              return (
                <Tabs.Tab
                  value={e.section ?? ""}
                  key={idx}
                  onClick={() => changeParams(links[idx].section!)}
                >
                  <NavLink label={e.title} leftSection={e.icon} />
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs>
        <div className={styles.pageWrapper}>{displayPage()}</div>
      </div>
      <div className={styles.wrapper}>
        <Box p="xs" w={300}>
          {topContent && <>{topContent}</>}
          <>
            {links.map((element, idx) => (
              <NavLink
                key={idx}
                active={element.section === sectionState}
                onClick={() => changeParams(links[idx].section!)}
                label={element.title}
                leftSection={element.icon}
              />
            ))}
          </>
        </Box>
        <div className={styles.pageWrapper}>{displayPage()}</div>
      </div>
    </>
  );
};

export default memo(LeftMenu);
