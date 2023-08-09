import ListItem from '@ui/ListItem/ListItem';
import { ITaskTestData } from '@custom-types/data/atomic';
import { useLocale } from '@hooks/useLocale';
import { Button, InputWrapper } from '@ui/basics';

import { FC, Fragment, memo, useCallback } from 'react';
import stepperStyles from '@styles/ui/stepper.module.css';
import OpenTextInNewTab from '@ui/OpenTextInNewTab/OpenTextInNewTab';

const Examples: FC<{ form: any; shrink?: boolean }> = ({
  form,
  shrink,
}) => {
  const { locale } = useLocale();

  const onDeleteExample = useCallback(
    (index: number) => {
      form.setFieldValue(
        'examples',
        (() => {
          form.values.examples.splice(index, 1);
          return form.values.examples;
        })()
      );
      form.validateField('examples');
    },
    [form]
  );

  return (
    <>
      {form.values.examples &&
        form.values.examples.map(
          (item: ITaskTestData, index: number) => (
            <Fragment key={index}>
              <ListItem
                field="examples"
                label={locale.task.form.example + ' #' + (index + 1)}
                inLabel={locale.task.form.inputExample}
                outLabel={locale.task.form.outputExample}
                form={form}
                index={index}
                onDelete={onDeleteExample}
                shrink={shrink}
                openInputNewTab={
                  <OpenTextInNewTab text={item.inputData} />
                }
                openOutputNewTab={
                  <OpenTextInNewTab text={item.outputData} />
                }
              />
            </Fragment>
          )
        )}
      {form.errors.examples && (
        <InputWrapper
          shrink={shrink}
          {...form.getInputProps('examples')}
          onChange={() => {}}
        />
      )}
      <Button
        className={stepperStyles.addButton}
        variant="light"
        onClick={() => {
          form.setFieldValue(
            'examples',
            (() => {
              form.values.examples.push({
                inputData: '',
                outputData: '',
              });
              return form.values.examples;
            })()
          );
          form.validateField('examples');
        }}
      >
        +
      </Button>
    </>
  );
};

export default memo(Examples);
