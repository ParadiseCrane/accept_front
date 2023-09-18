import { FC, memo } from 'react';
import { ILocale } from '@custom-types/ui/ILocale';
import { Button, LoadingOverlay, TextInput } from '@ui/basics';
import { UserSelect, UserSelector } from '@ui/selectors';
import styles from '../registrationManagement.module.css';
import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { setter } from '@custom-types/ui/atomic';

const Team: FC<{
  spec: string;
  refetch: setter<boolean>;
  users: IUserDisplay[];
  loading: boolean;
}> = ({ spec: _spec, refetch: _refetch, users, loading }) => {
  const { locale } = useLocale();

  const form = useForm({
    initialValues: {
      teamName: '',
      participants: [] as string[],
      capitan: '',
    },
    validate: {
      teamName: (value) => null,
      participants: (value) => (value.length == 0 ? 'Ошибка' : null),
      capitan: (value, values) =>
        values.participants.includes(value)
          ? 'Капинат должен быть участником команды'
          : null,
    },
  });

  return (
    <div className={styles.wrapper}>
      {<LoadingOverlay visible={loading} />}
      {users && (
        <>
          <TextInput />
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
          />
          <UserSelect
            label="Капитан"
            nothingFound="Ничего не найдено"
            placeholder="Найти"
            users={users.filter((item) =>
              form.values.participants.includes(item.login)
            )}
            select={(item) =>
              item && form.setFieldValue('capitan', item[0].login)
            }
          />

          <Button onClick={() => {}}>
            {locale.tournament.register}
          </Button>
        </>
      )}
    </div>
  );
};

export default memo(Team);
