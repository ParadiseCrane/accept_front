import { ITeamAdd } from '@custom-types/data/ITeam';
import { IUserDisplay } from '@custom-types/data/IUser';
import { setter } from '@custom-types/ui/atomic';
import { ILocale } from '@custom-types/ui/ILocale';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { Button, LoadingOverlay, TextInput } from '@ui/basics';
import { UserSelect, UserSelector } from '@ui/selectors';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useEffect, useMemo } from 'react';

import styles from '../registrationManagement.module.css';

const Team: FC<{
  spec: string;
  maxTeamSize: number;
  refetch: setter<boolean>;
  users: IUserDisplay[];
  participants: string[];
  loading: boolean;
}> = ({ spec, refetch, users, participants, loading, maxTeamSize }) => {
  const { locale, lang } = useLocale();

  const localUsers = useMemo(
    () => users.filter((user) => !participants.includes(user.login)),
    [participants, users]
  );

  const form = useForm({
    initialValues: {
      teamName: '',
      participants: [] as string[],
      capitan: '',
    },
    validate: {
      teamName: (value) => {
        value = value.trim().replace(/\s+/, ' ');
        return value.length == 0
          ? locale.tournament.registration.form.validation.teamName.empty
          : value.length < 4
            ? locale.tournament.registration.form.validation.teamName.minLength(
                4
              )
            : value.length > 20
              ? locale.tournament.registration.form.validation.teamName.maxLength(
                  20
                )
              : !value.match(/^[a-zA-Zа-яА-ЯЁё][a-zA-Zа-яА-ЯЁё_ ]+$/)
                ? locale.tournament.registration.form.validation.teamName
                    .invalid
                : null;
      },
      participants: (value) =>
        value.length == 0
          ? locale.tournament.registration.form.validation.participants.empty
          : value.length > maxTeamSize
            ? locale.tournament.registration.form.validation.participants.max(
                maxTeamSize
              )
            : null,
      capitan: (value, values) =>
        !values.participants.includes(value)
          ? locale.tournament.registration.form.validation.capitan
          : null,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const handleRegister = useCallback(() => {
    if (!form.isValid()) return;
    requestWithNotify<ITeamAdd, {}>(
      `team/${spec}`,
      'POST',
      locale.notify.tournament.registration,
      lang,
      () => '',
      {
        name: form.values.teamName,
        capitan: form.values.capitan,
        participants: form.values.participants,
      },
      () => {
        form.reset();
        refetch(true);
      }
    );
  }, [spec, refetch, locale, lang, form]);

  useEffect(() => {
    form.validateField('capitan');
  }, [form]);

  return (
    <div className={styles.wrapper}>
      <LoadingOverlay visible={loading} />
      <TextInput
        label={locale.tournament.registration.createTeam.teamNameLabel}
        {...form.getInputProps('teamName')}
      />
      <UserSelector
        users={localUsers}
        initialUsers={form.values.participants}
        setFieldValue={(participants) =>
          form.setFieldValue('participants', participants)
        }
        titles={(locale: ILocale) => [
          locale.dashboard.tournament.registrationManagementSelector.users,
          locale.dashboard.tournament.registrationManagementSelector
            .participants,
        ]}
        width="80%"
        inputProps={form.getInputProps('participants')}
      />
      <UserSelect
        label={locale.team.page.capitan}
        placeholder={locale.dashboard.attemptsList.user.placeholder}
        nothingFound={locale.dashboard.attemptsList.user.nothingFound}
        users={localUsers.filter((item) =>
          form.values.participants.includes(item.login)
        )}
        select={(item) => item && form.setFieldValue('capitan', item[0].login)}
        additionalProps={form.getInputProps('capitan')}
      />

      <Button onClick={handleRegister} disabled={!form.isValid()}>
        {locale.send}
      </Button>
    </div>
  );
};

export default memo(Team);
