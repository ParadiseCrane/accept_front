"use client";
import DeleteModal from "@components/Assignment/DeleteModal/DeleteModal";
import AttemptsList from "@components/Dashboard/AttemptsList/AttemptsList";
import ParticipantsList from "@components/Dashboard/ParticipantsList/ParticipantsList";
import Results from "@components/Dashboard/Results/Results";
import TimeInfo from "@components/Dashboard/TimeInfo/TimeInfo";
import { STICKY_SIZES } from "@constants/Sizes";
import { IAssignmentDisplay } from "@custom-types/data/IAssignment";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { useChatHosts } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { useRequest } from "@hooks/useRequest";
import { useUser } from "@hooks/useUser";
import { useWidth } from "@hooks/useWidth";
import { useInterval } from "@mantine/hooks";
import { Indicator } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";
import { FC, memo, useEffect, useMemo, useState } from "react";
import {
  IconAlignRight,
  IconBellPlus,
  IconMessages,
  IconPencil,
  IconPuzzle,
  IconTable,
  IconTrash,
  IconUsers,
  IconVocabulary,
} from "@tabler/icons-react";

import ChatPage from "./ChatPage/ChatPage";
import CreateNotification from "./CreateNotification/CreateNotification";
import TaskList from "./TaskList/TaskList";
import { useSearchParams } from "next/navigation";
import { LoadingOverlay } from "@mantine/core";

const AssignmentDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();

  const [assignment, setAssignment] = useState<IAssignmentDisplay>();

  const { data, refetch } = useRequest<undefined, IAssignmentDisplay>(
    `assignment/display/${spec}`,
    "GET",
  );

  const searchParams = useSearchParams();

  // AI-FEATURE FLAG
  // const { data: aiCount } = useRequest<undefined, number>(
  //   `assignment/attempts/ai/count/${spec}`,
  //   "GET",
  // );

  const refetchAssignment = useInterval(() => refetch(false), 60 * 1000);

  const { hasNewMessages } = useChatHosts();

  useEffect(() => {
    refetchAssignment.start();
    return refetchAssignment.stop;
  }, []); // eslint-disable-line

  useEffect(() => {
    if (data) setAssignment(data);
  }, [data]);

  const links = useMemo(
    (): IMenuLink[] => [
      {
        section: "assignment",
        title: locale.dashboard.assignment.mainInfo,
        icon: <IconVocabulary color="var(--secondary)" />,
      },
      {
        section: "chat",
        title: locale.dashboard.tournament.chat,
        icon: (
          <Indicator
            disabled={!hasNewMessages}
            processing
            color="var(--accent)"
            label="New"
          >
            <IconMessages color="var(--secondary)" />
          </Indicator>
        ),
      },
      {
        section: "results",
        title: locale.dashboard.assignment.results,
        icon: <IconTable color="var(--secondary)" />,
      },
      {
        section: "attempts",
        title: locale.dashboard.assignment.attempts,
        icon: <IconAlignRight color="var(--secondary)" />,
      },
      // AI-FEATURE FLAG
      // {
      //   icon: (
      //     <Indicator
      //       size={"lg"}
      //       label={aiCount}
      //       disabled={!aiCount}
      //       inline
      //       position="top-start"
      //     >
      //       <IconRobot color="var(--secondary)" />
      //     </Indicator>
      //   ),
      //   title: locale.dashboard.assignment.aiProbability,
      //   section: "ai_probability",
      // },
      {
        section: "participants",
        title: locale.dashboard.assignment.participants,
        icon: <IconUsers color="var(--secondary)" />,
      },
      {
        section: "tasks",
        title: locale.dashboard.assignment.tasks,
        icon: <IconPuzzle color="var(--secondary)" />,
      },
      {
        section: "create_notifications",
        title: locale.dashboard.assignment.createNotification,
        icon: <IconBellPlus color="var(--secondary)" />,
      },
    ],
    [locale, hasNewMessages],
  );

  const currentSection = searchParams?.get("section");

  const renderContent = () => {
    if (currentSection === "chat")
      return <ChatPage entity="assignment" spec={spec} />;
    if (currentSection === "participants")
      return <ParticipantsList type="assignment" spec={spec} />;
    if (currentSection === "tasks")
      return <TaskList type="assignment" spec={spec} />;
    if (!assignment)
      return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;

    switch (currentSection) {
      case "assignment":
        return (
          <TimeInfo
            type="assignment"
            entity={{
              title: assignment.title,
              spec: assignment.spec,
              creator: assignment.starter,
            }}
            timeInfo={{
              start: assignment.start,
              end: assignment.end,
              status: assignment.status.spec as 0 | 1 | 2,
              infinite: assignment.infinite,
            }}
            refetch={() => refetch(false)}
          />
        );
      case "results":
        return (
          <Results
            spec={spec}
            isFinished={!assignment.infinite && assignment.status.spec == 2}
            endDate={assignment.end}
            type="assignment"
            full
            is_team={false}
          />
        );
      case "attempts":
        return (
          <AttemptsList
            type="assignment"
            spec={assignment.spec}
            shouldNotRefetch={assignment.status.spec != 1}
            isFinished={assignment.status.spec == 2}
            endDate={assignment.end}
          />
        );
      case "create_notifications":
        return <CreateNotification spec={assignment.spec} type="assignment" />;
      default:
        return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;
    }
  };

  const [activeModal, setActiveModal] = useState(false);

  const { isTeacher } = useUser();
  const { width } = useWidth();

  const actions: IStickyAction[] = useMemo(
    () => [
      {
        color: "green",
        icon: (
          <IconPencil
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        href: `/assignment/edit/${spec}`,
        description: locale.tip.sticky.assignment.edit,
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
        description: locale.tip.sticky.assignment.delete,
      },
    ],
    [width, spec, locale],
  );

  return (
    <>
      {isTeacher && (
        <>
          {assignment && (
            <DeleteModal
              active={activeModal}
              setActive={setActiveModal}
              assignment={assignment}
            />
          )}
          <Sticky actions={actions} />
        </>
      )}
      <LeftMenu links={links}>{renderContent()}</LeftMenu>
    </>
  );
};

export default memo(AssignmentDashboard);
