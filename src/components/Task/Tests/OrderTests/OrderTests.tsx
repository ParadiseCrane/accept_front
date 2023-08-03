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
import { CustomDraggableList } from '@ui/CustomDraggableList/CustomDraggableList';
import { Item } from '@ui/CustomTransferList/CustomTransferList';
import { requestWithNotify } from '@utils/requestWithNotify';
import { Button } from '@ui/basics';
import stepperStyles from '@styles/ui/stepper.module.css';
import styles from './orderTests.module.css';

const OrderTests: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  tests: ITruncatedTaskTest[];
}> = ({ task_spec, refetch, tests }) => {
  const { locale, lang } = useLocale();
  const [localTests, setLocalTests] = useState<ITruncatedTaskTest[]>(
    []
  );

  const mappedTests = useMemo(
    () =>
      localTests.map((item) => ({
        label: `${locale.task.form.test} #${tests.indexOf(item) + 1}`,
        value: tests.indexOf(item),
      })),
    [localTests, tests, locale]
  );

  useEffect(() => {
    setLocalTests(tests);
  }, [tests]);

  const onTestChange = useCallback(
    (data: Item[]) => {
      let new_tests: ITruncatedTaskTest[] = new Array(tests.length);
      for (let i = 0; i < data.length; i++) {
        new_tests[i] = tests[data[i].value];
      }
      setLocalTests(new_tests);
    },
    [tests]
  );

  const onSubmit = useCallback(() => {
    requestWithNotify<string[], boolean>(
      `task/tests-reorder/${task_spec}`,
      'POST',
      locale.notify.task_test.reorder,
      lang,
      () => '',
      localTests.map((item) => item.spec),
      () => {
        refetch(false);
      }
    );
  }, [localTests, locale, lang, refetch, task_spec]);

  const onReset = useCallback(() => {
    setLocalTests(tests);
  }, [tests]);

  const testsHash = useMemo(
    () => tests.map((test) => test.spec.slice(3)).join(),
    [tests]
  );

  const localTestsHash = useMemo(
    () => localTests.map((test) => test.spec.slice(3)).join(),
    [localTests]
  );

  return (
    <div className={`${stepperStyles.wrapper} ${styles.wrapper}`}>
      <CustomDraggableList
        values={mappedTests}
        setValues={onTestChange}
        classNames={{
          label: styles.dragLabel,
        }}
      />
      <div className={styles.buttonsWrapper}>
        <Button
          kind="negative"
          variant="outline"
          onClick={onReset}
          disabled={testsHash == localTestsHash}
        >
          {locale.reset}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={testsHash == localTestsHash}
        >
          {locale.save}
        </Button>
      </div>
    </div>
  );
};

export default memo(OrderTests);
