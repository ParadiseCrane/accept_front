import { FC, memo, useCallback, useMemo } from 'react';
import { Radio, Switch } from '@ui/basics';

import styles from './additionalInfo.module.css';
import { useLocale } from '@hooks/useLocale';
import { IAssessmentType } from '@custom-types/data/atomic';
import { ISecurity } from '@custom-types/data/ITournament';

const AdditionalInfo: FC<{
  form: any;
  assessmentTypes: IAssessmentType[];
  securities: ISecurity[];
}> = ({ form, assessmentTypes, securities }) => {
  const { locale } = useLocale();
  const handlerAssessmentType = useCallback(
    (value: string) => {
      form.setFieldValue('assessmentType', value);
    },
    [form]
  );

  const handlerSecurity = useCallback(
    (value: string) => {
      form.setFieldValue('security', value);
    },
    [form]
  );

  const assessmentTypeItems = useMemo(
    () =>
      assessmentTypes.map((assessmentType) => ({
        value: assessmentType.spec.toString(),
        label:
          locale.tournament.form.assessmentType.variants[
            assessmentType.spec
          ],
      })),
    [locale, assessmentTypes]
  );
  const securityItems = useMemo(
    () =>
      securities.map((security) => ({
        value: security.spec.toString(),
        label:
          locale.tournament.form.security.variants[security.spec],
      })),
    [locale, securities]
  );
  return (
    <div className={styles.wrapper}>
      <Radio
        label={locale.tournament.form.assessmentType.title}
        field={'assessmentType'}
        form={form}
        items={assessmentTypeItems}
        onChange={handlerAssessmentType}
      />
      <Radio
        label={locale.tournament.form.security.title}
        field={'security'}
        form={form}
        items={securityItems}
        onChange={handlerSecurity}
        helperContent={locale.helpers.tournament.security}
      />
      <div className={styles.switchWrapper}>
        <Switch
          label={locale.tournament.form.allowRegistrationAfterStart}
          {...form.getInputProps('allowRegistrationAfterStart', {
            type: 'checkbox',
          })}
        />
        <Switch
          label={locale.tournament.form.shouldPenalizeAttempt}
          {...form.getInputProps('shouldPenalizeAttempt', {
            type: 'checkbox',
          })}
        />
      </div>
    </div>
  );
};

export default memo(AdditionalInfo);
