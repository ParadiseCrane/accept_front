import CustomEditor from '@ui/CustomEditor/CustomEditor';
import { useLocale } from '@hooks/useLocale';
import { RadioGroup, Radio, NumberInput } from '@mantine/core';

import { FC, memo } from 'react';
import styles from './descriptionInfo.module.css';
import { IHintAlarmType } from '@custom-types/data/atomic';

const DescriptionInfo: FC<{
  form: any;
  hintAlarmTypes: IHintAlarmType[];
}> = ({ form, hintAlarmTypes }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <CustomEditor
        classNames={{
          label: styles.label,
        }}
        label={locale.task.form.description}
        form={form}
        name={'description'}
      />
      <CustomEditor
        classNames={{
          label: styles.label,
        }}
        label={locale.task.form.inputFormat}
        form={form}
        name={'inputFormat'}
      />
      <CustomEditor
        classNames={{
          label: styles.label,
        }}
        label={locale.task.form.outputFormat}
        form={form}
        name={'outputFormat'}
      />

      <CustomEditor
        classNames={{
          label: styles.label,
        }}
        label={locale.task.form.remark}
        form={form}
        name={'remark'}
      />

      {!form.values.isTournament && form.values['hasHint'] && (
        <div className={styles.hintWrapper}>
          <div className={styles.label}>
            {locale.task.form.hint.title}
          </div>
          <RadioGroup
            size="lg"
            classNames={{
              label: styles.subLabel,
            }}
            label={locale.task.form.hint.alarmType}
            {...form.getInputProps('hintAlarmType')}
            onChange={(value) =>
              form.setFieldValue('hintAlarmType', value)
            }
            onBlur={() => form.validateField('hintAlarmType')}
          >
            {hintAlarmTypes.map(
              (hintAlarmType: IHintAlarmType, index: number) => (
                <Radio
                  value={hintAlarmType.spec.toString()}
                  key={index}
                  size="sm"
                  label={
                    locale.task.form.hint.hintAlarmTypes[
                      hintAlarmType.spec
                    ]
                  }
                />
              )
            )}
          </RadioGroup>
          <NumberInput
            label={locale.task.form.hint.showAfter}
            classNames={{
              label: styles.subLabel,
            }}
            size="md"
            hideControls
            min={0}
            onBlur={() => form.validateField('hintAlarm')}
            {...form.getInputProps('hintAlarm')}
          />
          <CustomEditor
            classNames={{
              label: styles.subLabel,
            }}
            label={locale.task.form.hint.text}
            form={form}
            name={'hintContent'}
          />
        </div>
      )}
    </div>
  );
};

export default memo(DescriptionInfo);
