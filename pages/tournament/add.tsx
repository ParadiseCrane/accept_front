import { ReactNode, useCallback, useMemo } from 'react';
import { GetStaticProps } from 'next';
import { getApiUrl } from '@utils/getServerUrl';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import {
  ITournamentAdd,
  ITournamentAddBundle,
} from '@custom-types/data/ITournament';
import { UTCDate, concatDateTime } from '@utils/datetime';
import Form from '@components/Tournament/Form/Form';
import { useRequest } from '@hooks/useRequest';
import { IUserDisplay } from '@custom-types/data/IUser';
import { Item } from '@ui/CustomTransferList/CustomTransferList';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';

function TournamentAdd(props: ITournamentAddBundle) {
  const { locale, lang } = useLocale();
  const { user } = useUser();

  const { data: users } = useRequest<{}, IUserDisplay[]>(
    'user/list-display',
    'GET',
    undefined,
    undefined,
    undefined,
    undefined,
    20000
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValues = useMemo(
    () => ({
      spec: '',
      author: user?.login || '',
      title: '',
      description: '',
      tasks: [],
      tags: [] as Item[],
      status: 0,

      startDate: new Date(),
      startTime: new Date(),
      endDate: new Date(),
      endTime: new Date(),
      frozeResultsDate: new Date(),
      frozeResultsTime: new Date(),

      participants: [],

      moderators: [],
      assessmentType: '0',

      shouldPenalizeAttempt: true,
      allowRegistrationAfterStart: false,
      banned: [],
    }),
    [user?.login]
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 5000,
        });
        return;
      }

      const tournament = {
        spec: '',
        author: user?.login || '',
        title: form.values.title,
        description: form.values.description,
        tasks: form.values.tasks,
        tags: form.values.tags.map((item) => item.value),
        status: 0,
        participants: form.values.participants,
        moderators: form.values.moderators,
        assessmentType: +form.values.assessmentType,
        shouldPenalizeAttempt: form.values.shouldPenalizeAttempt,
        allowRegistrationAfterStart:
          form.values.allowRegistrationAfterStart,
        start: UTCDate(
          concatDateTime(form.values.startDate, form.values.startTime)
        ),
        end: UTCDate(
          concatDateTime(form.values.endDate, form.values.endTime)
        ),
        frozeResults: UTCDate(
          concatDateTime(
            form.values.frozeResultsDate,
            form.values.frozeResultsTime
          )
        ),
        banned: form.values.banned,
      };

      requestWithNotify<ITournamentAdd, string>(
        'tournament/add',
        'POST',
        locale.notify.tournament.create,
        lang,
        (response) => response,
        tournament
      );
    },
    [lang, locale, user?.login]
  );

  return (
    <>
      <Title title={locale.titles.tournament.add} />
      <Form
        handleSubmit={handleSubmit}
        buttonLabel={locale.create}
        initialValues={initialValues}
        users={users || []}
        {...props}
      />
    </>
  );
}

TournamentAdd.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TournamentAdd;

const API_URL = getApiUrl();

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(
    `${API_URL}/api/bundle/tournament-add`
  );
  if (response.status === 200) {
    const response_json = await response.json();
    return {
      props: {
        assessmentTypes: response_json.assessment_types,
        tags: response_json.tags,
      },
      revalidate: REVALIDATION_TIME.tournament.add,
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
