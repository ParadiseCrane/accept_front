import { ITasksUsersBundle } from '@custom-types/data/bundle';
import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import { ITaskBaseInfo } from '@custom-types/data/ITask';
import {
  IParticipant,
  IParticipantListBundle,
  IUserDisplay,
} from '@custom-types/data/IUser';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import tableStyles from '@styles/ui/customTable.module.css';
import { default as AIProbabilityListUI } from '@ui/AIProbabilityList/AIProbabilityList';
import { SegmentedControl } from '@ui/basics';
import { TaskSelect, UserSelect } from '@ui/selectors';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';
import { getLocalDate } from '@utils/datetime';
import Link from 'next/link';
import { FC, memo, useCallback, useState } from 'react';

import styles from './aiProbabilityList.module.css';
import { Group, SelectProps } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export type TogglerValue = 'date' | 'ai_generated';

export type PercentageValue = '70' | '90';

const shouldPaint = (value: number, aiPercentage: string): boolean => {
  const percentileValue = 100 - (100 - parseInt(aiPercentage)) / 4;
  return value >= percentileValue;
};

const refactorAttempt = (
  attempt: IAttemptDisplay,
  type: string,
  spec: string,
  aiPercentage: PercentageValue
): any => ({
  ...attempt,
  date: {
    display: (
      <Link className={tableStyles.link} href={`/attempt/${attempt.spec}`}>
        {getLocalDate(attempt.date)}
      </Link>
    ),
    value: new Date(attempt.date).getTime(),
  },
  language: {
    display: <>{attempt.language.name}</>,
    value: attempt.language,
  },
  task: {
    display: (
      <Link
        href={`/task/${attempt.task.spec}?${type}=${spec}`}
        className={styles.taskLink}
      >
        {attempt.task.title}
      </Link>
    ),
    value: attempt.task,
  },
  author: {
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link className={tableStyles.link} href={`/profile/${attempt.author}`}>
          {attempt.author}
        </Link>
      </div>
    ),
    value: attempt.author,
  },
  ai_generated: {
    display: (
      <div
        className={`${tableStyles.titleWrapper} ${
          shouldPaint(attempt.ai_generated!, aiPercentage) && styles.red
        }`}
      >
        {attempt.ai_generated}%
      </div>
    ),
    value: attempt.ai_generated,
  },
});

const initialColumns = (
  locale: ILocale,
  toggler: TogglerValue
): ITableColumn[] => [
  {
    label: locale.attempt.date,
    key: 'date',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.date.value > b.date.value ? -1 : a.date.value == b.date.value ? 0 : 1,
    sorted: toggler !== 'date' ? 0 : 1,
    allowMiddleState: toggler !== 'date',
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.attempt.author,
    key: 'author',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.attempt.task,
    key: 'task',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 6,
  },
  {
    label: locale.attempt.aiProbability,
    key: 'ai_generated',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.ai_generated.value > b.ai_generated.value
        ? 1
        : a.ai_generated.value == b.ai_generated.value
          ? 0
          : -1,
    sorted: toggler !== 'ai_generated' ? 0 : 1,
    allowMiddleState: toggler !== 'ai_generated',
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.attempt.language,
    key: 'language',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 3,
  },
];

const AIProbabilityList: FC<{
  spec: string;
  shouldNotRefetch: boolean;
  type: 'assignment' | 'tournament';
}> = ({ spec, shouldNotRefetch, type }) => {
  const { locale } = useLocale();
  const [userSearch, setUserSearch] = useState<string[]>([]);
  const [taskSearch, setTaskSearch] = useState<string[]>([]);
  const [toggler, setToggler] = useState<TogglerValue>('ai_generated');
  const [aiPercentage, setAIPercentage] = useState<PercentageValue>('70');
  const refactor = useCallback(
    (attempt: IAttemptDisplay) =>
      refactorAttempt(attempt, type, spec, aiPercentage),
    [type, spec, aiPercentage]
  );

  const { data } = useRequest<{}, ITasksUsersBundle>(
    `${type}/bundle/tasks-users/${spec}`,
    'GET',
    undefined
  );

  const { data: userData } = useRequest<{}, IParticipantListBundle>(
    `${type}/bundle-participants/${spec}`,
    'GET',
    undefined
  );

  const iconProps = {
    stroke: 1.5,
    color: 'currentColor',
    opacity: 0.6,
    size: 18,
  };

  const renderSelectOption: SelectProps['renderOption'] = ({
    option,
    checked,
  }) => {
    return (
      <Group flex="1" gap="xs">
        <span
          style={{
            color: option.value.includes('banned') ? 'grey' : undefined,
          }}
        >
          {option.label}
        </span>
        {checked && (
          <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />
        )}
      </Group>
    );
  };

  return (
    <div className={styles.wrapper}>
      <SegmentedControl
        data={[
          {
            label: '70%',
            value: '70',
          },
          {
            label: '90%',
            value: '90',
          },
        ]}
        value={aiPercentage}
        onChange={(value) => {
          setAIPercentage(value as PercentageValue);
        }}
      />
      <div className={styles.selectors}>
        <UserSelect
          label={locale.dashboard.attemptsList.user.label}
          placeholder={locale.dashboard.attemptsList.user.placeholder}
          nothingFound={locale.dashboard.attemptsList.user.nothingFound}
          users={
            userData?.users
              ? userData.users.map((user) => {
                  if (user.banned) {
                    return {
                      ...user,
                      login: `${user.login}banned`,
                    } as IParticipant;
                  } else {
                    return user;
                  }
                })
              : []
          }
          select={(users: IUserDisplay[] | undefined) => {
            if (users)
              setUserSearch(
                users.map((user) => user.login.replace('banned', ''))
              );
            else setUserSearch([]);
          }}
          multiple
          renderOption={renderSelectOption}
        />
        <TaskSelect
          label={locale.dashboard.attemptsList.task.label}
          placeholder={locale.dashboard.attemptsList.task.placeholder}
          nothingFound={locale.dashboard.attemptsList.task.nothingFound}
          tasks={data?.tasks || []}
          select={(tasks: ITaskBaseInfo[] | undefined) => {
            if (tasks) setTaskSearch(tasks.map((task) => task.spec));
            else setTaskSearch([]);
          }}
          multiple
        />
      </div>
      <AIProbabilityListUI
        key={userSearch.toString() + taskSearch.toString()}
        url={`${type}/attempts/ai_generated/${spec}`}
        activeTab
        initialColumns={initialColumns}
        refactorAttempt={refactor}
        empty={<>{locale.dashboard.attemptsList.empty}</>}
        noDefault
        shouldNotRefetch={shouldNotRefetch}
        classNames={{
          wrapper: tableStyles.wrapper,
          table: tableStyles.table,
          headerCell: styles.headerCell,
          cell: styles.cell,
          even: tableStyles.even,
          odd: tableStyles.odd,
        }}
        userSearch={userSearch}
        taskSearch={taskSearch}
        aiPercentage={aiPercentage}
        toggler={toggler}
        setToggler={setToggler}
      />
    </div>
  );
};

export default memo(AIProbabilityList);
