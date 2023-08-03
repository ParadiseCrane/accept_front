import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Button } from '@ui/basics';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { CustomDraggableList } from '@ui/CustomDraggableList/CustomDraggableList';
import { Item } from '@ui/CustomTransferList/CustomTransferList';
import { requestWithNotify } from '@utils/requestWithNotify';

const OrderTests: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  tests: ITruncatedTaskTest[];
}> = ({ task_spec, refetch, tests }) => {
  const { locale, lang } = useLocale();
  const [localTests, setLocalTests] = useState<ITruncatedTaskTest[]>(
    []
  );
  const [opened, setOpened] = useState(false);

  const mappedTests = useMemo(
    () =>
      localTests.map((item, index) => ({
        label: `${locale.task.form.test} #${tests.indexOf(item) + 1}`,
        value: tests.indexOf(item),
      })),
    [localTests, tests]
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
      `task/test-reorder`,
      'POST',
      locale.notify.task_test.reorder,
      lang,
      () => '',
      localTests.map((item) => item.spec),
      () => {
        refetch(false);
        setOpened(false);
      }
    );
  }, [localTests]);

  const onClose = useCallback(() => {
    setOpened(false);
  }, []);

  return (
    <div>
      <Button // maybe move to sticky
        variant="outline"
        onClick={() => {
          setOpened(true);
        }}
      >
        Перемешать(???) тесты
      </Button>
      <SimpleModal
        opened={opened}
        title={locale.task.tests.addTest}
        close={onClose}
        hideCloseButton
      >
        <div>
          <CustomDraggableList
            values={mappedTests}
            setValues={onTestChange}
          />
          <SimpleButtonGroup
            actionButton={{
              label: locale.send,
              onClick: onSubmit,
              props: { disabled: tests == localTests },
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: onClose,
            }}
          />
        </div>
      </SimpleModal>
    </div>
  );
};

export default memo(OrderTests);
