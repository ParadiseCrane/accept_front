import DeleteModal from '@components/Task/DeleteModal/DeleteModal';
import Description from '@components/Task/Description/Description';
import { STICKY_SIZES } from '@constants/Sizes';
import { ILanguage } from '@custom-types/data/atomic';
import { IBarTask, ITask } from '@custom-types/data/ITask';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { useWidth } from '@hooks/useWidth';
import { DefaultLayout } from '@layouts/DefaultLayout';
import TaskLayout from '@layouts/TaskLayout';
import { sendRequest } from '@requests/request';
import { Kbd } from '@ui/basics';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import ChatSticky from '@ui/ChatSticky/ChatSticky';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import TasksBar from '@ui/TasksBar/TasksBar';
import Timer from '@ui/Timer/Timer';
import { getCookieValue } from '@utils/cookies';
import { getApiUrl } from '@utils/getServerUrl';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, Notes, Pencil, Trash } from 'tabler-icons-react';

const DynamicSend = dynamic(() => import('@components/Task/Send/Send'), {
  ssr: false,
});
const DynamicSendText = dynamic(
  () => import('@components/Task/SendText/SendText'),
  { ssr: false }
);
const DynamicResults = dynamic(
  () => import('@components/Task/Results/Results'),
  { ssr: false }
);

function Task(props: {
  task: ITask;
  languages: ILanguage[];
  has_write_rights: boolean;
  has_read_tests_rights: boolean;
}) {
  const task = props.task;
  const languages = props.languages;
  const hasWriteRights = props.has_write_rights;
  const hasReadTestsRights = props.has_read_tests_rights;
  const [activeModal, setActiveModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [openedHint, setOpenedHint] = useState(false);
  const [tasks, setTasks] = useState<IBarTask[]>([]);

  const { locale } = useLocale();
  const { isUser, user } = useUser();

  const { width } = useWidth();

  const router = useRouter();

  const type = useMemo(
    () =>
      router.query.assignment
        ? 'assignment'
        : router.query.tournament
          ? 'tournament'
          : 'regular',
    [router.query]
  );

  const querySpec = useMemo(
    () => router.query.assignment || router.query.tournament,
    [router.query]
  );

  const fetch_tasks = useCallback(
    (spec: string) => {
      return () =>
        sendRequest<undefined, IBarTask[]>(
          `${type}/tasks_status/${spec}`,
          'GET',
          undefined,
          5000
        ).then((res) => {
          if (!res.error) {
            setTasks(res.response);
          }
        });
    },
    [type]
  );

  useEffect(() => {
    let id: undefined | number = undefined;
    if (type !== 'regular' && typeof querySpec == 'string') {
      if (id) {
        window.clearInterval(id);
      }
      fetch_tasks(querySpec)();
      id = window.setInterval(fetch_tasks(querySpec), 5000);
    } else {
      setTasks([]);
    }
    return () => {
      if (id) {
        window.clearInterval(id);
      }
    };
  }, [querySpec, type, fetch_tasks]);

  const actions: IStickyAction[] = useMemo(() => {
    let inner_actions = [];
    if (task.hint && showHint) {
      inner_actions.push({
        color: 'var(--accent)',
        icon: (
          <Eye
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        onClick: () => setOpenedHint(true),
        description: locale.tip.sticky.task.hint,
      });
    }
    if (hasReadTestsRights) {
      inner_actions.push({
        color: 'blue',
        href: `/task/tests/${task.spec}`,
        icon: (
          <Notes
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        description: locale.tip.sticky.task.tests,
      });
    }

    if (hasWriteRights) {
      inner_actions.push(
        {
          color: 'green',
          href: `/task/edit/${task.spec}`,
          icon: (
            <Pencil
              width={STICKY_SIZES[width] / 3}
              height={STICKY_SIZES[width] / 3}
            />
          ),
          description: locale.tip.sticky.task.edit,
        },
        {
          color: 'red',
          icon: (
            <Trash
              width={STICKY_SIZES[width] / 3}
              height={STICKY_SIZES[width] / 3}
            />
          ),
          onClick: () => setActiveModal(true),
          description: locale.tip.sticky.task.delete,
        }
      );
    }

    return inner_actions;
  }, [showHint, hasReadTestsRights, hasWriteRights, task, width]);

  return (
    <>
      <Head>
        <meta property="og:title" content={task.title} />
        <meta
          property="og:description"
          content={task.description.replace(/<[^>]*>/g, '')}
        />
        <meta
          property="description"
          content={task.description.replace(/<[^>]*>/g, '')}
        />
      </Head>
      {type !== 'regular' && typeof querySpec === 'string' && (
        <>
          <TasksBar
            currentTask={task.spec}
            tasks={tasks}
            homeHref={`/${type}/${querySpec}`}
            taskQuery={`${type}=${querySpec}`}
          />
          {user && (
            <ChatSticky entity={type} spec={querySpec} host={user.login} />
          )}
          <Timer url={`${type}/info/${querySpec}`} />
        </>
      )}

      <DeleteModal
        active={activeModal}
        setActive={setActiveModal}
        task={task}
      />
      {task.hint && (
        <SimpleModal
          title={locale.task.form.hint.title}
          opened={openedHint}
          close={() => setOpenedHint(false)}
        >
          <div>
            <TipTapEditor
              editorMode={false}
              content={task.hint.content}
              onUpdate={() => {}}
            />
          </div>
        </SimpleModal>
      )}

      {actions.length == 1 && (
        <SingularSticky
          color={actions[0].color}
          icon={actions[0].icon}
          onClick={actions[0].onClick}
          href={actions[0].href}
          description={actions[0].description}
        />
      )}
      {actions.length > 1 && <Sticky actions={actions} />}
      <TaskLayout
        key={task.spec}
        title={`${locale.titles.task.spec} ${task.title}`}
        description={
          <Description
            task={task}
            setShowHint={setShowHint}
            languagesRestrictions={
              task.allowedLanguages.length > 0 ||
              task.forbiddenLanguages.length > 0
            }
          />
        }
        send={(set) =>
          isUser &&
          (task.taskType.spec == 0 ? (
            <DynamicSend
              spec={task.spec}
              setActiveTab={set}
              languages={languages}
              kbdHelperContent={
                <>
                  <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
                </>
              }
            />
          ) : (
            <DynamicSendText
              spec={task.spec}
              testsNumber={task.testsNumber}
              setActiveTab={set}
            />
          ))
        }
        results={(currentTab) =>
          isUser && <DynamicResults activeTab={currentTab} spec={task.spec} />
        }
      />
    </>
  );
}

Task.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Task;

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
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

  const response = await fetch(`${API_URL}/api/bundle/task-page/${spec}`, {
    method: 'GET',
    headers: {
      cookie: req.headers.cookie,
      Authorization: `Bearer ${access_token}`,
      'content-type': 'application/json',
    } as { [key: string]: string },
  });
  if (response.status === 200) {
    const response_json = await response.json();

    return {
      props: {
        task: response_json.task,
        languages: response_json.languages,
        has_write_rights: response_json.has_write_rights,
        has_read_tests_rights: response_json.has_read_tests_rights,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
