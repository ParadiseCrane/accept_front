import { FC, memo, useCallback, useMemo } from 'react';
import ListItem from '@ui/ListItem/ListItem';
import {
  ITaskCheckType,
  ITaskTestData,
  ITaskType,
} from '@custom-types/data/atomic';
import styles from './mainPage.module.css';
import { Dropzone, Helper, HelperTip } from '@ui/basics';
import stepperStyles from '@styles/ui/stepper.module.css';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import OpenTestInNewTab from '@ui/OpenTestInNewTab/OpenTestInNewTab';
import AddModal from '../AddModal/AddModal';
import EditTest from '../EditTest/EditTest';
import DeleteTest from '../DeleteTest/DeleteTest';
import { IChecker } from '@custom-types/data/ITask';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';

const MainPage: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  tests: ITruncatedTaskTest[];
  truncate_limit: number;
  taskType: ITaskType;
  checkType: ITaskCheckType;
  checker?: IChecker;
}> = ({
  task_spec,
  refetch,
  tests,
  truncate_limit,
  taskType,
  checkType,
  checker,
}) => {
  const { locale } = useLocale();

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
      if (checkType.spec == 0 && taskType.spec == 0) {
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
      } else if (taskType.spec == 1) {
        // text task
        for (let i = 0; i < outputs.length; i++) {
          if (outputs[i].index != i) break;
          tests.push({
            inputData: '',
            outputData: outputs[i].content,
          });
        }
      } else if (checkType.spec == 1) {
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
    [checkType.spec, taskType.spec]
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

  const EditAction = useCallback(
    (test: ITruncatedTaskTest, index: number) =>
      !test.isInputTruncated && !test.isOutputTruncated ? (
        <EditTest
          key={index * 2 + 1}
          refetch={refetch}
          test={test}
          hideInput={hideInput}
          hideOutput={hideOutput}
        />
      ) : (
        <HelperTip
          key={index * 2 + 1}
          multiline
          width={400}
          label={locale.task.tests.prohibitEdit(truncate_limit)}
        />
      ),
    [
      hideInput,
      hideOutput,
      locale.task.tests,
      refetch,
      truncate_limit,
    ]
  );

  return (
    <div className={stepperStyles.wrapper}>
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
          {tests.length == 0 && (
            <div className={styles.empty}>
              {locale.task.form.emptyTests}
              <Helper dropdownContent={helperContent} />
            </div>
          )}
          {tests.length > 0 &&
            tests.map((test: ITruncatedTaskTest, index: number) => (
              <div key={index} className={stepperStyles.example}>
                <ListItem
                  readonly
                  values={tests.map((item) => ({
                    inputData: item.isInputTruncated
                      ? item.inputData + '...'
                      : item.inputData,
                    outputData: item.isOutputTruncated
                      ? item.outputData + '...'
                      : item.outputData,
                  }))}
                  label={locale.task.form.test + ' #' + (index + 1)}
                  inLabel={locale.task.form.inputTest}
                  outLabel={locale.task.form.outputTest}
                  hideInput={taskType.spec == 1}
                  hideOutput={!!checker}
                  index={index}
                  maxRows={7}
                  minRows={7}
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
                    EditAction(test, index),
                  ]}
                />
                {(test.isInputTruncated ||
                  test.isOutputTruncated) && (
                  <div className={styles.truncationNote}>
                    {locale.task.tests.truncated(truncate_limit)}
                  </div>
                )}
              </div>
            ))}
          <AddModal
            task_spec={task_spec}
            refetch={refetch}
            hideInput={hideInput}
            hideOutput={hideOutput}
          />
        </div>
      </Dropzone>
    </div>
  );
};

export default memo(MainPage);
