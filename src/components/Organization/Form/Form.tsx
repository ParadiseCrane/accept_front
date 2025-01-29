import { IUserDisplay } from '@custom-types/data/IUser';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType, useForm } from '@mantine/form';
import stepperStyles from '@styles/ui/stepper.module.css';
import { Button, CustomEditor, Helper, Switch, TextInput } from '@ui/basics';
import { UserSelector } from '@ui/selectors';
import { FC, useCallback, useEffect, useMemo } from 'react';

import styles from './form.module.css';

const Form: FC<{
  buttonText: string;
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
}> = ({ initialValues, handleSubmit, buttonText }) => {
  const { locale } = useLocale();
  const { isAdmin } = useUser();

  const form = useForm({
    initialValues,
    validate: {
      spec: (value) =>
        value.length < 3 ? locale.organization.form.validation.spec(3) : null,
      name: (value) =>
        value.length < 3 ? locale.organization.form.validation.name(3) : null,
      description: (value) =>
        value.length == 0
          ? locale.organization.form.validation.description
          : null,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  return (
    <div className={stepperStyles.wrapper}>
      <TextInput
        label={locale.organization.spec}
        required
        {...form.getInputProps('spec')}
      />

      <TextInput
        label={locale.organization.name}
        required
        {...form.getInputProps('name')}
      />

      <CustomEditor
        form={form}
        label={locale.organization.description}
        name={'description'}
      />

      <div className={styles.readOnlySwitch}>
        <Switch
          label={locale.organization.allowRegistration}
          {...form.getInputProps('allowRegistration', { type: 'checkbox' })}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          color="var(--primary)"
          onClick={() => {
            form.validate();
            handleSubmit(form);
          }}
          disabled={Object.keys(form.errors).length !== 0}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default Form;
