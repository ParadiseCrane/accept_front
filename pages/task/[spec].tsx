"use client";
import DeleteModal from "@components/Task/DeleteModal/DeleteModal";
import Description from "@components/Task/Description/Description";
import { STICKY_SIZES } from "@constants/Sizes";
import { ILanguage } from "@custom-types/data/atomic";
import { IBarTask, ITask } from "@custom-types/data/ITask";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { useWidth } from "@hooks/useWidth";
import { DefaultLayout } from "@layouts/DefaultLayout";
import TaskLayout from "@layouts/TaskLayout";
import { sendRequest } from "@requests/request";
import { TipTapEditor } from "@ui/basics/TipTapEditor/TipTapEditor";
import ChatSticky from "@ui/ChatSticky/ChatSticky";
import SimpleModal from "@ui/SimpleModal/SimpleModal";
import SingularSticky from "@ui/Sticky/SingularSticky";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";
import TasksBar from "@ui/TasksBar/TasksBar";
import Timer from "@ui/Timer/Timer";
import { getApiUrl } from "@utils/getServerUrl";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { IconEye, IconNotes, IconPencil, IconTrash } from "@tabler/icons-react";
import { Kbd } from "@mantine/core";
import { useRequest } from "@hooks/useRequest";
import SendTab from "@components/Task/Send/Send";

interface TaskRights {
  has_write_rights: boolean;
  has_read_tests_rights: boolean;
}

const DynamicSendText = dynamic(
  () => import("@components/Task/SendText/SendText"),
  { ssr: false },
);
const DynamicResults = dynamic(
  () => import("@components/Task/Results/Results"),
  { ssr: false },
);

function Task(props: { task: ITask; languages: ILanguage[] }) {
  const task = props.task;
  const languages = props.languages;
  const [activeModal, setActiveModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [openedHint, setOpenedHint] = useState(false);
  const [tasks, setTasks] = useState<IBarTask[]>([]);

  const { locale } = useLocale();
  const { isUser, user } = useUser();

  const { width } = useWidth();

  const router = useRouter();

  const { data: rights } = useRequest<{}, TaskRights>(
    `/task/rights/${task.spec}`,
    "GET",
  );

  const hasWriteRights = rights?.has_write_rights || false;
  const hasReadTestsRights = rights?.has_read_tests_rights || false;

  // Compute homeHref from query (client‑side)
  const { assignment, tournament, lesson, course } = router.query;
  const homeHref = assignment
    ? `/assignment/${assignment}`
    : tournament
      ? `/tournament/${tournament}`
      : lesson && course
        ? `/course/${course}?item=${lesson}`
        : null;

  const type = useMemo(
    () =>
      router.query.assignment
        ? "assignment"
        : router.query.tournament
          ? "tournament"
          : router.query.lesson
            ? "lesson"
            : "regular",
    [router.query],
  );

  const querySpec = useMemo(
    () =>
      router.query.assignment || router.query.tournament || router.query.lesson,
    [router.query],
  );

  const fetch_tasks = useCallback(
    (spec: string) => {
      return () =>
        sendRequest<undefined, IBarTask[]>(
          `${type}/tasks_status/${spec}`,
          "GET",
          undefined,
          5000,
        ).then((res) => {
          if (!res.error) {
            setTasks(res.response);
          }
        });
    },
    [type],
  );

  useEffect(() => {
    let id: undefined | number = undefined;
    if (type !== "regular" && typeof querySpec == "string") {
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
        color: "var(--accent)",
        icon: (
          <IconEye
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
        color: "blue",
        href: `/task/tests/${task.spec}`,
        icon: (
          <IconNotes
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
          color: "green",
          href: `/task/edit/${task.spec}`,
          icon: (
            <IconPencil
              width={STICKY_SIZES[width] / 3}
              height={STICKY_SIZES[width] / 3}
            />
          ),
          description: locale.tip.sticky.task.edit,
        },
        {
          color: "red",
          icon: (
            <IconTrash
              width={STICKY_SIZES[width] / 3}
              height={STICKY_SIZES[width] / 3}
            />
          ),
          onClick: () => setActiveModal(true),
          description: locale.tip.sticky.task.delete,
        },
      );
    }

    return inner_actions;
  }, [showHint, hasReadTestsRights, hasWriteRights, task, width, locale]);

  return (
    <>
      <Head>
        <meta property="og:title" content={task.title} />
        <meta
          property="og:description"
          content={task.description.replace(/<[^>]*>/g, "")}
        />
        <meta
          property="description"
          content={task.description.replace(/<[^>]*>/g, "")}
        />
      </Head>
      {type !== "regular" && typeof querySpec === "string" && (
        <>
          <TasksBar
            currentTask={task.spec}
            tasks={tasks}
            homeHref={homeHref ?? `/${type}/${querySpec}`}
            taskQuery={`${type}=${querySpec}`}
          />
          {user && (
            <ChatSticky entity={type} spec={querySpec} host={user.login} />
          )}
          {type !== "lesson" && <Timer url={`${type}/info/${querySpec}`} />}
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
            <SendTab
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

export const getStaticPaths: GetStaticPaths = async () => {
  // Optionally pre‑render popular tasks
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const spec = params?.spec as string;

  const response = await fetch(`${API_URL}/api/bundle/task-static/${spec}`);
  if (response.status === 200) {
    const response_json = await response.json();

    return {
      props: {
        task: response_json.task,
        languages: response_json.languages,
      },
      revalidate: 60,
    };
  }
  return {
    notFound: true,
  };
};
