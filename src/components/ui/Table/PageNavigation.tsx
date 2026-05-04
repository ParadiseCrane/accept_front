"use client";
import { useLocale } from "@hooks/useLocale";
import { Pagination } from "@mantine/core";
import { Icon, Select } from "@ui/basics";
import { FC, memo, useMemo, useState } from "react";

import styles from "./table.module.css";
import { useDebouncedCallback } from "@mantine/hooks";

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
  const [currentPage, setCurrentPage] = useState(pageProps + 1);
  const displayPagination = totalLength > 0 && totalLength > onPage[0];

  const debouncedCallback = useDebouncedCallback((page) => {
    handlePageChange(Math.min(page - 1, lastPage));
  }, 500);

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
        {displayPagination && (
          <div className={styles.pageNavigationWrapper}>
            <Pagination
              total={perPage === 0 ? 1 : totalPages}
              value={perPage === 0 ? 1 : currentPage}
              disabled={perPage === 0}
              onChange={(page) => {
                setCurrentPage(page);
                debouncedCallback(page);
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
