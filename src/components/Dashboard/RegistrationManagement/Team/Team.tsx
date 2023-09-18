import { FC, memo, useCallback } from 'react';
import { ILocale } from '@custom-types/ui/ILocale';
import { Button, LoadingOverlay, TextInput } from '@ui/basics';
import { UserSelect, UserSelector } from '@ui/selectors';
import styles from '../registrationManagement.module.css';
import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { setter } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import { ITeamAdd } from '@custom-types/data/ITeam';

const Team: FC<{
  spec: string;
  refetch: setter<boolean>;
  users: IUserDisplay[];
  participants: string[];
  loading: boolean;
}> = ({ spec, refetch, users, loading }) => {
  const { locale, lang } = useLocale();

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
          ? locale.tournament.registration.form.validation.teamName
              .empty
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
          ? locale.tournament.registration.form.validation
              .participants
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
      () => refetch
    );
  }, [spec, refetch, locale, lang, form]);

  return (
    <div className={styles.wrapper}>
      {<LoadingOverlay visible={loading} />}
      {users && (
        <>
          <TextInput {...form.getInputProps('teamName')} />
          <UserSelector
            users={users}
            initialUsers={form.values.participants}
            setFieldValue={(participants) =>
              form.setFieldValue('participants', participants)
            }
            titles={(locale: ILocale) => [
              locale.dashboard.tournament
                .registrationManagementSelector.users,
              locale.dashboard.tournament
                .registrationManagementSelector.participants,
            ]}
            width="60%"
            inputProps={form.getInputProps('participants')}
          />
          <UserSelect
            label={locale.team.page.capitan}
            placeholder={
              locale.dashboard.attemptsList.user.placeholder
            }
            nothingFound={
              locale.dashboard.attemptsList.user.nothingFound
            }
            users={users.filter((item) =>
              form.values.participants.includes(item.login)
            )}
            select={(item) =>
              item && form.setFieldValue('capitan', item[0].login)
            }
            {...form.getInputProps('capitan')}
          />

          <Button onClick={handleRegister} disabled={!form.isValid()}>
            {locale.tournament.register}
          </Button>
        </>
      )}
    </div>
  );
};

export default memo(Team);
