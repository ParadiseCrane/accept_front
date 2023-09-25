import { ActionIcon } from '@mantine/core';
import { Eye } from 'tabler-icons-react';
import { FC, memo } from 'react';
import Link from 'next/link';

const OpenTask: FC<{ spec: string }> = ({ spec }) => {
  return (
    <ActionIcon
      component={Link}
      href={`/task/${spec}`}
      target="_blank"
      tabIndex={5}
      color="var(--primary)"
      variant="transparent"
      size="lg"
    >
      <Eye width={20} height={20} />
    </ActionIcon>
  );
};

export default memo(OpenTask);
