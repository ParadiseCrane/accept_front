import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { Item } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { NumberInput, Radio, Switch, TextInput } from '@ui/basics';
import { TagSelector } from '@ui/selectors';
import { FC, memo, useCallback, useMemo } from 'react';

import styles from './mainInfo.module.css';

const MainInfo: FC<{
  form: any;
  taskTypes: ITaskType[];
  taskCheckTypes: ITaskCheckType[];
}> = ({ form, taskTypes, taskCheckTypes }) => {
  const { locale } = useLocale();
  const initialTags = useMemo(
    () => {
      return form.values.tags;
    },
    [form.values.tags.length] // eslint-disable-line
  );

  const taskCheckTypeItems = useMemo(
    () =>
      taskCheckTypes.map((checkType) => ({
        value: checkType.spec.toString(),
        label: locale.task.form.checkTypes[checkType.spec],
      })),
    [locale, taskCheckTypes]
  );

  const taskTypeItems = useMemo(
    () =>
      taskTypes.map((taskType) => ({
        value: taskType.spec.toString(),
        label: locale.task.form.taskTypes[taskType.spec],
      })),
    [locale, taskTypes]
  );

  const handlerTaskType = useCallback(
    (value: string) => {
      form.setFieldValue('taskType', value);
      value === '1' ? form.setFieldValue('checkType', '0') : () => {};
      form.validateField('tests');
    },
    [form]
  );

  const setUsed = useCallback(
    (value: Item[]) => form.setFieldValue('tags', value),
    [form.setFieldValue] // eslint-disable-line
  );

  return (
    <>
      <TextInput
        label={locale.task.form.title}
        required
        {...form.getInputProps('title')}
      />

      <TagSelector
        initialTags={initialTags}
        setUsed={setUsed}
        fetchURL={'tag/list'}
        addURL={'tag/add'}
        updateURL={'tag/edit'}
        deleteURL={'tag/delete'}
        form={form}
        field={'tags'}
      />

      <NumberInput
        label={locale.task.form.complexity}
        required
        noClampOnBlur
        hideControls
        {...form.getInputProps('complexity')}
      />
      <div className={styles.radioGroups}>
        <Radio
          label={locale.task.form.taskType}
          field={'taskType'}
          form={form}
          items={taskTypeItems}
          onChange={handlerTaskType}
          helperContent={
            <div>
              {locale.helpers.task.taskType.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
        />
        {form.values.taskType === '0' && (
          <Radio
            label={locale.task.form.checkType}
            field={'checkType'}
            form={form}
            items={taskCheckTypeItems}
            onChange={(value) => {
              form.setFieldValue('checkType', value);
              form.validateField('tests');
            }}
          />
        )}
        {!form.values.isTournament && (
          <Switch
            label={locale.task.form.hint.title}
            {...form.getInputProps('hasHint', { type: 'checkbox' })}
          />
        )}
      </div>
    </>
  );
};

export default memo(MainInfo);
