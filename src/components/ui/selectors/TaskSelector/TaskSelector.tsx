import { ITaskDisplay } from '@custom-types/data/ITask';
import { Item, setter } from '@custom-types/ui/atomic';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import { TaskItem } from './TaskItem/TaskItem';
import styles from './taskSelector.module.css';

const TaskSelector: FC<{
  initialTasks: Item[];
  setUsed: setter<Item[]>;
  classNames?: object;
  width?: string;
  height?: string;
}> = ({ setUsed, initialTasks, width, height }) => {
  const { locale } = useLocale();
  const initialTasksInner = useMemo(() => initialTasks, []); //eslint-disable-line

  const [tasks, setTasks] = useState<ICustomTransferListData>(undefined);
  const [allTasks, setAllTasks] = useState<ITaskDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!data) return;
      setUsed(data[1]);
      setTasks(data);
    },
    [setUsed]
  );

  useEffect(() => {
    const selected = initialTasksInner.map((task) => task.value);
    let data: ICustomTransferListData = [[], []];

    for (let i = 0; i < allTasks.length; i++) {
      const task = {
        ...allTasks[i],
        value: allTasks[i].spec,
        label: allTasks[i].title,
        sortValue: allTasks[i].title,
      };
      if (!selected.includes(task.value)) {
        data[0].push(task);
      } else {
        data[1].push(task);
      }
    }
    setTasks(data);
  }, [initialTasksInner, allTasks]);

  const refetch = useCallback(async () => {
    setLoading(true);
    sendRequest<{}, ITaskDisplay[]>('task/list', 'GET', undefined, 3000).then(
      (res) => {
        if (res.error) return;
        setAllTasks(res.response);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    refetch();
  }, []); // eslint-disable-line

  const itemComponent: ICustomTransferListItemComponent = useCallback(
    ({ item, onClick, index }) => {
      return <TaskItem key={index} item={item} onSelect={onClick} />;
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <CustomTransferList
        loading={loading}
        value={tasks}
        onChange={onChange}
        searchKeys={['title']}
        titles={[
          locale.assignmentSchema.form.taskSelector.available,
          locale.assignmentSchema.form.taskSelector.used,
        ]}
        itemComponent={itemComponent}
        width={width}
        height={height}
      />
    </div>
  );
};

export default memo(TaskSelector);
