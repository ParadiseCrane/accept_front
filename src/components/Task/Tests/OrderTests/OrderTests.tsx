import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { requestWithNotify } from '@utils/requestWithNotify';
import { Button } from '@ui/basics';
import stepperStyles from '@styles/ui/stepper.module.css';
import styles from './orderTests.module.css';
import CustomDraggableBoard from '@ui/CustomDraggableBoard/CustomDraggableBoard';
import {
  IDraggableBoardColumn,
  IDraggableBoardItem,
} from '@custom-types/ui/IDraggableBoard';
import { ILocale } from '@custom-types/ui/ILocale';
import { useWidth } from '@hooks/useWidth';
import { HORIZONTAL_TESTS_DRAG_LIMIT } from '@constants/Limits';

const intoColumns = (
  grouped_tests: ITruncatedTaskTest[][],
  locale: ILocale
): IDraggableBoardColumn[] => {
  let flatten = grouped_tests.flat();
  let specIndexMap: { [key: string]: any } = {};
  for (let i = 0; i < flatten.length; i++) {
    specIndexMap[flatten[i].spec] = i;
  }
  return grouped_tests.map(
    (values, index) =>
      ({
        id: index.toString(),
        columnLabel: `${locale.task.tests.group.label} #${index + 1}`,
        values: values.map(
          (item) =>
            ({
              id: item.spec,
              label: `${locale.task.tests.test} #${
                specIndexMap[item.spec] + 1
              }`,
            } as IDraggableBoardItem)
        ),
      } as IDraggableBoardColumn)
  );
};
const fromColumns = (
  columns: IDraggableBoardColumn[]
): string[][] => {
  return columns.map((column) =>
    column.values.map((item) => item.id)
  );
};

const OrderTests: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  grouped_tests: ITruncatedTaskTest[][];
}> = ({ task_spec, refetch, grouped_tests }) => {
  const { locale, lang } = useLocale();
  const { is768 } = useWidth();

  const [localColumns, setLocalColumns] = useState<
    IDraggableBoardColumn[]
  >([]);

  const onReset = useCallback(() => {
    setLocalColumns(intoColumns(grouped_tests, locale));
  }, [grouped_tests, locale]);

  useEffect(() => {
    onReset();
  }, [onReset]);

  const onSubmit = useCallback(() => {
    requestWithNotify<string[][], boolean>(
      `task/tests-reorder/${task_spec}`,
      'POST',
      locale.notify.task_test.reorder,
      lang,
      () => '',
      fromColumns(localColumns),
      () => {
        refetch(false);
      }
    );
  }, [localColumns, locale, lang, refetch, task_spec]);

  const testsHash = useMemo(
    () =>
      grouped_tests
        .map(
          (group) =>
            group.length.toString() +
            group.map((item) => item.spec.slice(3))
        )
        .join() + grouped_tests.length.toString(),
    [grouped_tests]
  );

  const columnsHash = useMemo(
    () =>
      localColumns
        .map(
          (column) =>
            column.values.length.toString() +
            column.values.map((item) => item.id.slice(3))
        )
        .join() + localColumns.length.toString(),
    [localColumns]
  );

  const boardDirection = useMemo(
    () =>
      !is768 || localColumns.length > HORIZONTAL_TESTS_DRAG_LIMIT
        ? 'vertical'
        : 'horizontal',
    [is768, localColumns]
  );

  return (
    <div className={`${stepperStyles.wrapper} ${styles.wrapper}`}>
      <CustomDraggableBoard
        columns={localColumns}
        setColumns={setLocalColumns}
        horizontal={boardDirection == 'horizontal'}
      />
      <div className={styles.buttonsWrapper}>
        <Button
          variant="outline"
          onClick={onReset}
          disabled={testsHash == columnsHash}
        >
          {locale.reset}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={testsHash == columnsHash}
        >
          {locale.save}
        </Button>
      </div>
    </div>
  );
};

export default memo(OrderTests);
