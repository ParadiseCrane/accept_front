import { useLocale } from '@hooks/useLocale';

import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import styles from './taskSelector.module.css';
import { sendRequest } from '@requests/request';
import { ITaskDisplay } from '@custom-types/data/ITask';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import { TaskItem } from './TaskItem/TaskItem';
import { Item, setter } from '@custom-types/ui/atomic';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';

const TaskSelector: FC<{
  initialTasks: Item[];
  setUsed: setter<any>;
  classNames?: object;
}> = ({ setUsed, classNames, initialTasks }) => {
  const { locale } = useLocale();
  const initialTasksInner = useMemo(() => initialTasks, []); //eslint-disable-line

  const [tasks, setTasks] =
    useState<ICustomTransferListData>(undefined);
  const [allTasks, setAllTasks] = useState<ITaskDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!!!data) return;
      setUsed(data[1].map((item) => item.login));
      setTasks(data);
    },
    [setUsed]
  );

  useEffect(() => {
    const selected = initialTasks.map((task) => task.value);
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
  }, [initialTasks, allTasks]);

  const refetch = useCallback(async () => {
    setLoading(true);
    sendRequest<{}, ITaskDisplay[]>(
      'task/list',
      'GET',
      undefined,
      3000
    ).then((res) => {
      if (res.error) return;
      setAllTasks(res.response);
      setLoading(false);
    });
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
        // classNames={classNames ? classNames : {}}
        searchKeys={['title']}
        titles={[
          locale.assignmentSchema.form.taskSelector.available,
          locale.assignmentSchema.form.taskSelector.used,
        ]}
        itemComponent={itemComponent}
      />
    </div>
  );
};

export default memo(TaskSelector);
