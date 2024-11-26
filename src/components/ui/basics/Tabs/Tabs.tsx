import { FC, ReactNode, memo, useState } from 'react';

import { Tabs as MantineTabs, TabsProps } from '@mantine/core';
import { setter } from '@custom-types/ui/atomic';

interface TabPage {
  value: string;
  title: string;
  page: (_: string | null, __: setter<string | null>) => ReactNode;
}

interface Props extends Omit<TabsProps, 'children'> {
  pages: TabPage[];
  defaultPage: string;
}

const Tabs: FC<Props> = ({ pages, defaultPage, ...props }) => {
  const [activeTab, setActiveTab] = useState<string | null>(defaultPage);

  return (
    <MantineTabs
      style={{
        width: '100%',
        height: '100%',
      }}
      styles={{ tabLabel: { fontSize: 'var(--font-size-s)' } }}
      value={activeTab}
      onChange={setActiveTab}
      {...props}
    >
      <MantineTabs.List grow>
        {pages.map((page, idx) => (
          <MantineTabs.Tab key={idx} value={page.value}>
            {page.title}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {pages.map((page, idx) => (
        <MantineTabs.Panel key={idx} value={page.value} pt="xs">
          {page.page(activeTab, setActiveTab)}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
};

export default memo(Tabs);
