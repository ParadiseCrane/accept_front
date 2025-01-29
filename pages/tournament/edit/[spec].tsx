import { ReactNode, useCallback, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { getApiUrl } from '@utils/getServerUrl';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import {
  ITournamentAdd,
  ITournamentEditBundle,
} from '@custom-types/data/ITournament';
import { timezoneDate } from '@utils/datetime';
import Form from '@components/Tournament/Form/Form';
import { useRequest } from '@hooks/useRequest';
import { IUserDisplay } from '@custom-types/data/IUser';
import { getCookieValue } from '@utils/cookies';
import { useUser } from '@hooks/useUser';

function TournamentEdit(props: ITournamentEditBundle) {
  const { locale, lang } = useLocale();
  const tournament = props.tournament;

  const { data: users } = useRequest<{}, IUserDisplay[]>(
    'user/list-display',
    'GET',
    undefined,
    undefined,
    undefined,
    undefined,
    20000
  );

  const initialValues = useMemo(
    () => ({
      ...tournament,

      tags: tournament.tags.map((spec) => {
        const tag = props.tags.find((elem) => elem.spec == spec);

        if (!tag) {
          // TODO: Any ideas to write in normal way?
          return;
        }
        return {
          value: tag.spec,
          label: tag.title,
        };
      }),
      assessmentType: tournament.assessmentType.toString(),
      security: tournament.security.toString(),
      start: timezoneDate(tournament.start),
      end: timezoneDate(tournament.end),
      frozeResults: timezoneDate(tournament.frozeResults),
    }),
    [tournament]
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
        spec: form.values.spec,
        organization: form.values.organization,
        public: form.values.public,
        author: form.values.author,
        title: form.values.title,
        description: form.values.description,
        tasks: form.values.tasks,
        // @ts-ignore-line
        tags: form.values.tags.map((tag) => tag.value),
        status: form.values.status,
        moderators: form.values.moderators,
        assessmentType: +form.values.assessmentType,
        shouldPenalizeAttempt: form.values.shouldPenalizeAttempt,
        allowRegistrationAfterStart: form.values.allowRegistrationAfterStart,
        start: form.values.start,
        end: form.values.end,
        frozeResults: form.values.frozeResults,
        security: +form.values.security,
        maxTeamSize: +form.values.maxTeamSize,
      } as ITournamentAdd;

      requestWithNotify<ITournamentAdd, string>(
        'tournament/edit',
        'POST',
        locale.notify.tournament.edit,
        lang,
        (response) => response,
        tournament
      );
    },
    [lang, locale]
  );

  return (
    <>
      <Title title={locale.titles.tournament.edit} />
      <Form
        handleSubmit={handleSubmit}
        buttonLabel={locale.edit}
        initialValues={initialValues}
        users={users || []}
        {...props}
      />
    </>
  );
}

TournamentEdit.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TournamentEdit;

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }
  const spec = query.spec;
  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  const response = await fetch(
    `${API_URL}/api/bundle/tournament-edit/${spec}`,
    {
      headers: {
        cookie: req.headers.cookie,
        Authorization: `Bearer ${access_token}`,
      } as { [key: string]: string },
    }
  );

  if (response.status === 200) {
    const response_json = await response.json();
    return {
      props: {
        tournament: response_json.tournament,
        assessmentTypes: response_json.assessment_types,
        tags: response_json.tags,
        securities: response_json.securities,
      } as ITournamentEditBundle,
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
