// @ts-nocheck
import { ITag } from '@custom-types/data/ITag';
import { Badge } from '@mantine/core';
import { FC, memo } from 'react';

import styles from './tagList.module.css';

const TagList: FC<{ tags: ITag[] }> = ({ tags }) => {
  return (
    <div className={styles.wrapper}>
      {tags.map((tag, idx) => (
        <Badge key={idx} variant="outline" color="gray">
          {tag.title || tag.label}
        </Badge>
      ))}
    </div>
  );
};

export default memo(TagList);
