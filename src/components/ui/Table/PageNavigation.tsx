import { useLocale } from '@hooks/useLocale';
import { Icon, Select } from '@ui/basics';

import { FC, memo, useMemo } from 'react';
import {
  ArrowNarrowLeft,
  ArrowNarrowRight,
  ChevronLeft,
  ChevronRight,
} from 'tabler-icons-react';
import styles from './table.module.css';
import { ActionIconGroup, Group } from '@mantine/core';

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
  page,
  perPage,
  defaultOnPage,
  totalLength,
  handlePerPageChange,
  handlePageChange,
}) => {
  const { locale } = useLocale();
  const lastPage = useMemo(
    () => Math.ceil(totalLength / (perPage || totalLength || 1)) - 1,
    [totalLength, perPage]
  );

  return (
    <div className={styles.footer}>
      <div className={styles.pagesWrapper}>
        <div>
          {locale.ui.table.overall} {totalLength}
        </div>
        {totalLength > 0 && (
          <div className={styles.pageNavigationWrapper}>
            <div className={styles.perPageWrapper}>
              <div className={styles.perPage}>
                {locale.ui.table.perPage + ':'}{' '}
              </div>
              <Select
                data={onPage
                  .map((value) => ({
                    label: value.toString(),
                    value: value.toString(),
                  }))
                  .concat({
                    label: locale.all,
                    value: '0',
                  })}
                classNames={{
                  input: styles.selectPerPage,
                }}
                defaultValue={defaultOnPage.toString()}
                onChange={(value) => handlePerPageChange(Number(value))}
              />
            </div>
            <Group gap="xs">
              <ActionIconGroup>
                <Icon
                  color="gray"
                  size="xs"
                  disabled={page == 0}
                  onClick={() => handlePageChange(0)}
                >
                  <ArrowNarrowLeft />
                </Icon>
                <Icon
                  color="gray"
                  disabled={page == 0}
                  size="xs"
                  onClick={() => handlePageChange(Math.max(page - 1, 0))}
                >
                  <ChevronLeft />
                </Icon>
              </ActionIconGroup>
              <div>
                {page * perPage + 1} -{' '}
                {perPage
                  ? Math.min((page + 1) * perPage, totalLength)
                  : totalLength}
              </div>
              <ActionIconGroup>
                <Icon
                  color="gray"
                  size="xs"
                  disabled={page == lastPage}
                  onClick={() => handlePageChange(Math.min(page + 1, lastPage))}
                >
                  <ChevronRight />
                </Icon>
                <Icon
                  color="gray"
                  size="xs"
                  disabled={page == lastPage}
                  onClick={() => handlePageChange(lastPage)}
                >
                  <ArrowNarrowRight />
                </Icon>
              </ActionIconGroup>
            </Group>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PageNavigation);
