"use client";
import { useLocale } from "@hooks/useLocale";
import { ActionIconGroup, Group, Pagination } from "@mantine/core";
import { Icon, Select } from "@ui/basics";
import { FC, memo, useMemo } from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import styles from "./table.module.css";

const PageNavigation: FC<{
  onPage: number[];
  defaultOnPage: number;
  perPage: number;
  page: number;
  totalLength: number;
  handlePerPageChange: (_: number) => void;
  handlePageChange: (_: number) => void;
}> = ({
  onPage,
  page: pageProps,
  perPage,
  defaultOnPage,
  totalLength,
  handlePerPageChange,
  handlePageChange,
}) => {
  const { locale } = useLocale();
  const page = pageProps + 1;

  const totalPages = useMemo(
    () => Math.max(Math.ceil(totalLength / perPage), 1),
    [totalLength, perPage],
  );

  const lastPage = useMemo(
    () => Math.ceil(totalLength / (perPage || totalLength || 1)),
    [totalLength, perPage],
  );

  return (
    <div className={styles.footer}>
      <div className={styles.pagesWrapper}>
        <div className={styles.total}>
          {locale.ui.table.overall} {totalLength}
        </div>
        {totalLength > 0 && (
          <div className={styles.pageNavigationWrapper}>
            <Pagination
              total={perPage === 0 ? 1 : totalPages}
              value={perPage === 0 ? 1 : page}
              disabled={perPage === 0}
              onChange={(page) => {
                handlePageChange(Math.min(page - 1, lastPage));
              }}
            />
            <div className={styles.perPageWrapper}>
              <div className={styles.perPage}>
                {locale.ui.table.perPage + ":"}{" "}
              </div>
              <Select
                data={onPage
                  .map((value) => ({
                    label: value.toString(),
                    value: value.toString(),
                  }))
                  .concat({
                    label: locale.all,
                    value: "0",
                  })}
                classNames={{
                  input: styles.selectPerPage,
                }}
                defaultValue={defaultOnPage.toString()}
                onChange={(value) => handlePerPageChange(Number(value))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PageNavigation);
