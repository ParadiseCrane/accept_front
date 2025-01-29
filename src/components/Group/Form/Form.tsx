import { IUserDisplay } from '@custom-types/data/IUser';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType, useForm } from '@mantine/form';
import stepperStyles from '@styles/ui/stepper.module.css';
import { Button, Helper, Switch, TextInput } from '@ui/basics';
import { UserSelector } from '@ui/selectors';
import { FC, useCallback, useEffect, useMemo } from 'react';

import styles from './form.module.css';

const Form: FC<{
  buttonText: string;
  users: IUserDisplay[];
  handleSubmit: callback<UseFormReturnType<any>>;
  hideReadonly?: boolean;
  initialValues: any;
}> = ({ initialValues, handleSubmit, buttonText, users, hideReadonly }) => {
  const { locale } = useLocale();
  const { isAdmin } = useUser();

  const form = useForm({
    initialValues,
    validate: {
      name: (value) =>
        value.length < 3 ? locale.group.form.validation.name(3) : null,
      members: (value) => {
        value.length < 2 ? locale.group.form.validation.members(2) : null;
      },
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  const setFieldValue = useCallback(
    (users: string[]) => form.setFieldValue('members', users),
    [] // eslint-disable-line
  );
  const initialProps = useMemo(() => {
    form.getInputProps('members');
  }, []); // eslint-disable-line

  return (
    <div className={stepperStyles.wrapper}>
      <TextInput
        label={locale.group.name}
        required
        disabled={!hideReadonly && form.values.readonly}
        {...form.getInputProps('name')}
      />

      {!hideReadonly && isAdmin && (
        <div className={styles.readOnlySwitch}>
          <Switch
            label={locale.group.readonly}
            {...form.getInputProps('readonly', { type: 'checkbox' })}
          />
          <Helper dropdownContent={locale.helpers.group.readOnly} />
        </div>
      )}
      <UserSelector
        setFieldValue={setFieldValue}
        inputProps={initialProps}
        users={users}
        initialUsers={form.values.members}
      />
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
