import { FC, memo, useEffect } from 'react';
import { ITask } from '@custom-types/data/ITask';
import styles from './description.module.css';
import { Group, Table, Title } from '@mantine/core';
import { useLocale } from '@hooks/useLocale';

import CopyButton from '@ui/CopyButton/CopyButton';

import { sendRequest } from '@requests/request';
import { setter } from '@custom-types/ui/atomic';
import { AlertCircle } from 'tabler-icons-react';
import TagList from '@ui/TagList/TagList';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

const Description: FC<{
  task: ITask;
  setShowHint: setter<boolean>;
  preview?: boolean;
  languagesRestrictions?: boolean;
}> = ({ task, preview, setShowHint, languagesRestrictions }) => {
  const { locale } = useLocale();

  useEffect(() => {
    if (preview) return;
    sendRequest<{}, boolean>(
      `task/should_show_hint/${task.spec}`,
      'GET',
      undefined,
      5000
    ).then((res) => {
      setShowHint(res.response);
    });
  }, [task.spec, setShowHint, preview]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{task.title}</div>
        <div
          className={styles.complexity}
        >{`${locale.task.complexity} ${task.complexity}%`}</div>
      </div>
      <div className={styles.constraints}>
        <div
          className={styles.memory}
        >{`${locale.task.constraints.memory}: ${task.constraints.memory}Mb`}</div>
        <div
          className={styles.time}
        >{`${locale.task.constraints.time}: ${task.constraints.time}s`}</div>
      </div>
      <div className={styles.tags}>
        <TagList tags={task.tags} />
      </div>
      <div
        className={styles.description}
        children={
          <TipTapEditor
            editorMode={false}
            content={task.description}
            onUpdate={() => {}}
          />
        }
      />
      {languagesRestrictions && (
        <div className={styles.languagesRestrictions}>
          <AlertCircle color={'var(--negative)'} />

          <div className={styles.alert}>
            {locale.task.description.languagesRestrictions}
          </div>
        </div>
      )}
      <div className={styles.formatWrapper}>
        <div className={styles.inputFormat}>
          <div className={styles.formatLabel}>
            {locale.task.description.format.input}
          </div>
          <div
            className={styles.inputFormat}
            children={
              <TipTapEditor
                editorMode={false}
                content={task.inputFormat}
                onUpdate={() => {}}
              />
            }
          />
        </div>
        <div className={styles.outputFormat}>
          <div className={styles.formatLabel}>
            {locale.task.description.format.output}
          </div>
          <div
            className={styles.outputFormat}
            children={
              <TipTapEditor
                editorMode={false}
                content={task.outputFormat}
                onUpdate={() => {}}
              />
            }
          />
        </div>
      </div>
      <div className={styles.tablesWrapper}>
        <div className={styles.examplesLabel}>
          {locale.task.description.examples.title}
        </div>
        <Table
          striped
          withColumnBorders
          verticalSpacing="md"
          highlightOnHover
          className={styles.table}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Td>
                <Title order={4}>
                  {locale.task.description.examples.input}
                </Title>
              </Table.Td>
              <Table.Td>
                <Title order={4}>
                  {locale.task.description.examples.output}
                </Title>
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {task.examples.map((example, index) => (
              <Table.Tr key={index}>
                <Table.Td valign="top">
                  <Group
                    wrap="nowrap"
                    justify="space-between"
                    align="flex-start"
                  >
                    {example.inputData}
                    <CopyButton toCopy={example.inputData} />
                  </Group>
                </Table.Td>
                <Table.Td valign="top">
                  <Group
                    wrap="nowrap"
                    justify="space-between"
                    align="flex-start"
                  >
                    {example.outputData}
                    <CopyButton toCopy={example.outputData} />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      {task.remark && (
        <div className={styles.remarkWrapper}>
          <div className={styles.remarkLabel}>{locale.task.form.remark}</div>
          <div
            className={styles.remark}
            children={
              <TipTapEditor
                editorMode={false}
                content={task.remark}
                onUpdate={() => {}}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default memo(Description);
