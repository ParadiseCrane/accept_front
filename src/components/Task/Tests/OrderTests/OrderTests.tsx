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

const intoColumns = (
  grouped_tests: ITruncatedTaskTest[][]
): IDraggableBoardColumn[] => {
  let flattern = grouped_tests.flat();
  let specIndexMap: { [key: string]: any } = {};
  for (let i = 0; i < flattern.length; i++) {
    specIndexMap[flattern[i].spec] = i;
  }
  return grouped_tests.map(
    (values, index) =>
      ({
        id: index.toString(),
        columnLabel: `Group #${index + 1}`,
        values: values.map(
          (item) =>
            ({
              id: item.spec,
              label: `Test #${specIndexMap[item.spec] + 1}`,
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
  // const tests = grouped_tests[0];
  const { locale, lang } = useLocale();
  const [localColumns, setLocalColumns] = useState<
    IDraggableBoardColumn[]
  >([]);

  const onReset = useCallback(() => {
    setLocalColumns(intoColumns(grouped_tests));
  }, [grouped_tests]);

  useEffect(() => {
    onReset();
  }, [grouped_tests]);

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
        .map((test) => test.map((item) => item.spec.slice(3)))
        .join(),
    [grouped_tests]
  );

  const columnsHash = useMemo(
    () =>
      localColumns
        .map((columns) =>
          columns.values.map((item) => item.id.slice(3))
        )
        .join(),
    [localColumns]
  );

  return (
    <div className={`${stepperStyles.wrapper} ${styles.wrapper}`}>
      <CustomDraggableBoard
        columns={localColumns}
        setColumns={setLocalColumns}
        horizontal
      />
      <div className={styles.buttonsWrapper}>
        <Button
          kind="negative"
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
