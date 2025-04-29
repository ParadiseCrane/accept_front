// @ts-nocheck
import { ITag } from '@custom-types/data/ITag';
import { Badge } from '@mantine/core';
import { FC, memo } from 'react';
import { Tip } from '@ui/basics';

import styles from './tagList.module.css';
import { ILocale } from '@custom-types/ui/ILocale';

const TagList: FC<{ tags: ITag[]; locale?: ILocale }> = ({ tags, locale }) => {
  return (
    <div className={styles.wrapper}>
      {tags.map((tag, idx) => (
        <Badge key={idx} variant="outline" color="gray">
          {locale ? (
            <Tip label={locale.task.list.publicTag}>
              {tag.title || tag.label}
            </Tip>
          ) : (
            <>{tag.title || tag.label}</>
          )}
        </Badge>
      ))}
    </div>
  );
};

export default memo(TagList);
