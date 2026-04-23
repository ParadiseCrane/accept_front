"use client";
import { setter } from "@custom-types/ui/atomic";
import { Tabs as MantineTabs } from "@mantine/core";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FC, ReactNode, memo, useCallback, useEffect } from "react";

interface TabPage {
  value: string;
  title: string;
  page: (_: string | null, __: setter<string | null>) => ReactNode;
}

interface Props {
  pages: TabPage[];
  defaultPage?: string;
}

const UrlTabsPagesRouter: FC<Props> = ({
  pages,
  defaultPage = pages[0].value,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams?.get("tab");

  const changeParams = useCallback(
    (tab: string | null) => {
      if (searchParams) {
        const tabValue =
          searchParams.get("tab")?.length === 0 ? defaultPage : tab;
        router.replace(
          { pathname: `${pathname}`, query: { tab: tabValue } },
          undefined,
          {
            shallow: true,
            scroll: false,
          },
        );
      }
    },
    [searchParams, pathname],
  );

  useEffect(() => {
    if (searchParams && searchParams.size === 0) {
      changeParams(defaultPage);
    }
  }, [searchParams]);

  return (
    <MantineTabs value={activeTab} onChange={changeParams}>
      <MantineTabs.List>
        {pages.map((page, idx) => (
          <MantineTabs.Tab key={idx} value={page.value}>
            {page.title}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {pages.map((page, idx) => (
        <MantineTabs.Panel key={idx} value={page.value}>
          {page.page(activeTab ?? null, changeParams)}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
};

export default memo(UrlTabsPagesRouter);
