import { useLocale } from '@hooks/useLocale';
import {
  NumberInput,
  Radio,
  RadioGroup,
  Switch,
  TextInput,
} from '@mantine/core';

import { FC, memo, useMemo } from 'react';
import TagSelector from '@ui/TagSelector/TagSelector';
import styles from './mainInfo.module.css';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { Item } from '@components/ui/CustomTransferList/CustomTransferList';

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
    [form.values.spec] // eslint-disable-line
  );

  return (
    <div className={styles.wrapper}>
      <TextInput
        classNames={{
          label: styles.label,
        }}
        size="lg"
        label={locale.task.form.title}
        required
        onBlur={() => {
          form.validateField('title');
        }}
        {...form.getInputProps('title')}
      />

      <div>
        <TagSelector
          classNames={{
            label: styles.label,
          }}
          initialTags={initialTags}
          setUsed={(values: Item[]) => {
            form.setFieldValue('tags', values);
            form.validateField('tags');
          }}
          fetchURL={'tag/list'}
          addURL={'tag/add'}
          updateURL={'tag/edit'}
          deleteURL={'tag/delete'}
        />
        <NumberInput
          classNames={{
            label: styles.label,
          }}
          size="lg"
          label={locale.task.form.complexity}
          required
          noClampOnBlur
          hideControls
          onBlur={() => {
            form.validateField('complexity');
          }}
          {...form.getInputProps('complexity')}
        />
      </div>
      <div className={styles.radioGroups}>
        <RadioGroup
          classNames={{
            label: styles.label,
          }}
          size="md"
          label={locale.task.form.taskType}
          {...form.getInputProps('taskType')}
          onChange={(value) => {
            form.setFieldValue('taskType', value);
            value === '1'
              ? form.setFieldValue('checkType', '0')
              : () => {};
          }}
        >
          {taskTypes.map((taskType: ITaskType, index: number) => (
            <Radio
              value={taskType.spec.toString()}
              key={index}
              label={locale.task.form.taskTypes[taskType.spec]}
            />
          ))}
        </RadioGroup>

        {form.values.taskType === '0' && (
          <RadioGroup
            classNames={{
              label: styles.label,
            }}
            size="md"
            label={locale.task.form.checkType}
            {...form.getInputProps('checkType')}
          >
            {taskCheckTypes.map(
              (checkType: ITaskCheckType, index: number) => (
                <Radio
                  value={checkType.spec.toString()}
                  key={index}
                  label={locale.task.form.checkTypes[checkType.spec]}
                />
              )
            )}
          </RadioGroup>
        )}
        {!form.values.isTournament && (
          <Switch
            classNames={{
              label: styles.label,
            }}
            label={locale.task.form.hint.title}
            size="lg"
            {...form.getInputProps('hasHint', { type: 'checkbox' })}
          />
        )}
      </div>
    </div>
  );
};

export default memo(MainInfo);
