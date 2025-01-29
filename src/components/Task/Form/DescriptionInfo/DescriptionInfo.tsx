import { IHintAlarmType } from '@custom-types/data/atomic';
import { useLocale } from '@hooks/useLocale';
import { CustomEditor, NumberInput, Radio } from '@ui/basics';
import { FC, memo, useMemo } from 'react';

import styles from './descriptionInfo.module.css';

const DescriptionInfo: FC<{
  form: any;
  hintAlarmTypes: IHintAlarmType[];
}> = ({ form, hintAlarmTypes }) => {
  const { locale } = useLocale();

  const hintAlarmTypeItems = useMemo(
    () =>
      hintAlarmTypes.map((alarmType) => ({
        value: alarmType.spec.toString(),
        label: locale.task.form.hint.hintAlarmTypes[alarmType.spec],
      })),
    [locale, hintAlarmTypes]
  );

  return (
    <>
      <CustomEditor
        label={locale.task.form.description}
        form={form}
        name={'description'}
      />
      <CustomEditor
        label={locale.task.form.inputFormat}
        form={form}
        name={'inputFormat'}
      />
      <CustomEditor
        label={locale.task.form.outputFormat}
        form={form}
        name={'outputFormat'}
      />

      <CustomEditor
        label={locale.task.form.remark}
        form={form}
        name={'remark'}
      />

      {!form.values.isTournament && form.values['hasHint'] && (
        <div className={styles.hintWrapper}>
          <CustomEditor
            label={locale.task.form.hint.text}
            form={form}
            name={'hintContent'}
          />
          <Radio
            label={locale.task.form.hint.alarmType}
            form={form}
            field={'hintAlarmType'}
            items={hintAlarmTypeItems}
            onChange={(value) => form.setFieldValue('hintAlarmType', value)}
          />
          <NumberInput
            label={locale.task.form.hint.showAfter}
            hideControls
            min={0}
            {...form.getInputProps('hintAlarm')}
          />
        </div>
      )}
    </>
  );
};

export default memo(DescriptionInfo);
