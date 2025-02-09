import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { Icon } from '@ui/basics';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Users, ChevronRight } from 'tabler-icons-react';

import styles from './styles.module.css';
import CourseGroupSelector from '@ui/selectors/CourseGroupSelector/CourseGroupSelector';
import { IImagePreset } from '@custom-types/data/IImagePreset';

const GroupSelector: FC<{ url: string }> = ({ url }: { url: string }) => {
  const [showSelector, setShowSelector] = useState(false);
  const { locale } = useLocale();

  // const { data, loading, refetch } = useRequest<{}, BaseTimeInfo, TimeInfo>(
  //   url,
  //   'GET',
  //   undefined,
  //   (data) => ({
  //     start: data.start,
  //     end: data.end,
  //     infinite: data.infinite || false,
  //     status: data.status,
  //   })
  // );

  return (
    <>
      {/* {!loading && data && !data.infinite && ( */}
      {
        <div
          className={styles.wrapper + ' ' + (showSelector ? styles.show : '')}
        >
          <Icon
            size={'sm'}
            className={styles.iconRoot}
            wrapperClassName={styles.iconWrapper}
            onClick={() => {
              setShowSelector((value) => !value);
            }}
          >
            {showSelector ? (
              <ChevronRight color={'var(--primary)'} />
            ) : (
              <Users color={'var(--primary)'} />
            )}
          </Icon>
          <div className={styles.selectorWrapper}>
            <div className={styles.selector}>
              <CourseGroupSelector
                label={''}
                groups={[]}
                currentGroup={null}
                select={() => {}}
              />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default memo(GroupSelector);
