import ListItem from '@ui/ListItem/ListItem';
import {
  ITaskCheckType,
  ITaskTestData,
  ITaskType,
} from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useMemo } from 'react';
import styles from './tests.module.css';
import { Dropzone, Helper, InputWrapper } from '@ui/basics';
import { useForm } from '@mantine/form';
import stepperStyles from '@styles/ui/stepper.module.css';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import OpenTestInNewTab from '@ui/OpenTestInNewTab/OpenTestInNewTab';
import AddModal from './AddModal/AddModal';
import { setter } from '@custom-types/ui/atomic';
import EditTest from './EditTest/EditTest';
import DeleteTest from './DeleteTest/DeleteTest';

const Tests: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  tests: ITruncatedTaskTest[];
  taskType: ITaskType;
  checkType: ITaskCheckType;
  checker?: IChecker;
}> = ({
  task_spec,
  refetch,
  tests,
  taskType,
  checkType,
  checker,
}) => {
  const { locale, lang } = useLocale();

  const form = useForm({
    initialValues: { tests, taskType, checkType },
  });

  // const onDeleteTest = useCallback(
  //   (index: number) => {
  //     const test = form.values.tests[index];
  //     requestWithNotify<undefined, boolean>(
  //       `task_test/delete/${test.spec}`,
  //       'POST',
  //       locale.notify.task_test.delete,
  //       lang,
  //       (_: boolean) => '',
  //       undefined,
  //       () => {
  //         form.setFieldValue(
  //           'tests',
  //           (() => {
  //             form.values.tests.splice(index, 1);
  //             return form.values.tests;
  //           })()
  //         );
  //       }
  //     );
  //   },
  //   [form, lang, locale]
  // );

  const onDrop = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      const length = files.length;
      var inputs: { content: string; index: number }[] = [];
      var outputs: {
        content: string;
        index: number;
      }[] = [];
      for (let i = 0; i < length; i++) {
        const name = files[i].name.startsWith('input')
          ? 'input'
          : files[i].name.startsWith('output')
          ? 'output'
          : '';
        switch (name) {
          case 'input':
            inputs.push({
              index: +files[i].name.slice(
                5,
                files[i].name.lastIndexOf('.')
              ),
              content: await files[i].text(),
            });
            break;

          case 'output':
            outputs.push({
              index: +files[i].name.slice(
                6,
                files[i].name.lastIndexOf('.')
              ),
              content: await files[i].text(),
            });
            break;
          default:
            continue;
        }
      }

      inputs.sort((a, b) => a.index - b.index);
      outputs.sort((a, b) => a.index - b.index);

      let tests: ITaskTestData[] = [];
      if (
        form.values.checkType.spec == 0 &&
        form.values.taskType.spec == 0
      ) {
        // tests and code
        for (
          let i = 0;
          i < Math.min(inputs.length, outputs.length);
          i++
        ) {
          if (inputs[i].index != i || outputs[i].index != i) break;
          tests.push({
            inputData: inputs[i].content,
            outputData: outputs[i].content,
          });
        }
      } else if (form.values.taskType.spec == 1) {
        // text task
        for (let i = 0; i < outputs.length; i++) {
          if (outputs[i].index != i) break;
          tests.push({
            inputData: '',
            outputData: outputs[i].content,
          });
        }
      } else if (form.values.checkType.spec == 1) {
        // checker
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i].index != i) break;
          tests.push({
            inputData: inputs[i].content,
            outputData: '',
          });
        }
      }
    },
    [form]
  );

  const helperContent = useMemo(
    () => (
      <div>
        {locale.helpers.dropzone.test.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    ),
    [locale]
  );

  const hideInput = useMemo(
    () => taskType.spec == 1,
    [taskType.spec]
  );
  const hideOutput = useMemo(() => !!checker, [checker]);

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        title={locale.ui.codeArea.dragFiles}
        helperContent={locale.ui.codeArea.filesRestrictions}
        description={''}
        showButton
        plural
        maxSize={100000 * 2} // amount of symbols * average utf-8 symbol size
        buttonProps={{
          style: {
            width: '100%',
          },
          dropdownContent: helperContent,
        }}
      >
        <div className={styles.inner}>
          {form.values.tests.length == 0 && (
            <div className={styles.empty}>
              {locale.task.form.emptyTests}
              <Helper dropdownContent={helperContent} />
            </div>
          )}
          {form.values.tests.length > 0 &&
            form.values.tests.map(
              (test: ITruncatedTaskTest, index: number) => (
                <div key={index} className={stepperStyles.example}>
                  <ListItem
                    field="tests"
                    label={locale.task.form.test + ' #' + (index + 1)}
                    inLabel={locale.task.form.inputTest}
                    outLabel={locale.task.form.outputTest}
                    form={form}
                    hideInput={form.values.taskType.spec == 1}
                    hideOutput={!!checker}
                    index={index}
                    maxRows={7}
                    minRows={7}
                    readonly
                    openInputNewTab={
                      <OpenTestInNewTab
                        spec={test.spec}
                        field={'input'}
                      />
                    }
                    openOutputNewTab={
                      <OpenTestInNewTab
                        spec={test.spec}
                        field={'output'}
                      />
                    }
                    additionalActions={[
                      <DeleteTest
                        key={index}
                        index={index * 2}
                        test={test}
                        refetch={() => refetch(false)}
                      />,
                    ].concat(
                      !test.isInputTruncated &&
                        !test.isOutputTruncated
                        ? [
                            <EditTest
                              key={index * 2 + 1}
                              refetch={refetch}
                              test={test}
                              hideInput={hideInput}
                              hideOutput={hideOutput}
                            />,
                          ]
                        : []
                    )}
                  />
                </div>
              )
            )}
          {form.errors.tests && (
            <InputWrapper
              {...form.getInputProps('tests')}
              onChange={() => {}}
            />
          )}

          <AddModal
            task_spec={task_spec}
            refetch={refetch}
            hideInput={hideInput}
            hideOutput={hideOutput}
          />
        </div>
      </Dropzone>
    </>
  );
};

export default memo(Tests);
