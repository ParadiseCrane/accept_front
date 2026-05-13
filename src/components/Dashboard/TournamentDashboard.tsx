"use client";
import AttemptsList from "@components/Dashboard/AttemptsList/AttemptsList";
import TimeInfo from "@components/Dashboard/TimeInfo/TimeInfo";
import DeleteModal from "@components/Tournament/DeleteModal/DeleteModal";
import { STICKY_SIZES } from "@constants/Sizes";
import { ITournament } from "@custom-types/data/ITournament";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { useChatHosts } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { useWidth } from "@hooks/useWidth";
import { Indicator } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";
import { FC, memo, useEffect, useMemo, useState } from "react";
import {
  IconAddressBook,
  IconAlignRight,
  IconBan,
  IconBellPlus,
  IconMessages,
  IconPencil,
  IconPuzzle,
  IconSettings as SettingsIcon,
  IconTable,
  IconTrash,
  IconUsers,
  IconVocabulary,
} from "@tabler/icons-react";

import ChatPage from "./ChatPage/ChatPage";
import CreateNotification from "./CreateNotification/CreateNotification";
import ParticipantsListWithBan from "./ParticipantsList/ParticipantsListWithBan";
import RegistrationManagement from "./RegistrationManagement/RegistrationManagement";
import Results from "./Results/Results";
import Settings from "./Settings/Settings";
import TaskList from "./TaskList/TaskList";
import TeamList from "./TeamList/TeamList";
import { useRequest } from "@hooks/useRequest";
import { DEFAULT_REQUEST_CACHE_TIME } from "@constants/Limits";
import { useSearchParams } from "next/navigation";
import { LoadingOverlay } from "@mantine/core";

const TournamentDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();
  const searchParams = useSearchParams();

  const [tournament, setTournament] = useState<ITournament>();

  const { data } = useRequest<undefined, ITournament>(
    `tournament/${spec}`,
    "GET",
    undefined,
    undefined,
    undefined,
    undefined,
    DEFAULT_REQUEST_CACHE_TIME,
  );

  // AI-FEATURE FLAG
  // const { data: aiCount } = useRequest<undefined, number>(
  //   `tournament/attempts/ai/count/${spec}`,
  //   "GET",
  // );

  useEffect(() => {
    if (data) setTournament(data);
  }, [data]);

  const { hasNewMessages } = useChatHosts();

  const links = useMemo(() => {
    const isTeam = tournament?.maxTeamSize !== 1;

    const base = [
      {
        section: "tournament",
        title: locale.dashboard.tournament.mainInfo,
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
        title: locale.dashboard.tournament.results,
        icon: <IconTable color="var(--secondary)" />,
      },
      {
        section: "attempts",
        title: locale.dashboard.tournament.attempts,
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
      //   title: locale.dashboard.tournament.aiProbability,
      //   section: "ai_probability",
      // },
      {
        section: "participants",
        title: locale.dashboard.tournament.participants,
        icon: <IconUsers color="var(--secondary)" />,
      },
      {
        section: "tasks",
        title: locale.dashboard.tournament.tasks,
        icon: <IconPuzzle color="var(--secondary)" />,
      },
      {
        section: "registration",
        title: locale.dashboard.tournament.registrationManagement,
        icon: <IconAddressBook color="var(--secondary)" />,
      },
      {
        section: "create_notification",
        title: locale.dashboard.tournament.createNotification,
        icon: <IconBellPlus color="var(--secondary)" />,
      },
      {
        section: "banned_attempts",
        title: locale.dashboard.tournament.bannedAttempts,
        icon: <IconBan color="var(--secondary)" />,
      },
      {
        section: "settings",
        title: locale.dashboard.tournament.settings.self,
        icon: <SettingsIcon color="var(--secondary)" />,
      },
    ];

    if (isTeam) {
      base.splice(4, 0, {
        section: "teams",
        title: locale.dashboard.tournament.teams,
        icon: <IconUsers color="var(--secondary)" />,
      });
    }

    return base;
  }, [tournament?.maxTeamSize, hasNewMessages, locale]);

  const currentSection = searchParams?.get("section") || links[0].section;

  const renderActivePage = () => {
    switch (currentSection) {
      case "chat":
        return <ChatPage spec={spec} entity="tournament" />;
      case "tasks":
        return <TaskList type="tournament" spec={spec} />;
      case "teams":
        return <TeamList spec={spec} />;
    }

    if (!tournament)
      return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;

    const isTeam = tournament.maxTeamSize !== 1;

    switch (currentSection) {
      case "tournament":
        return (
          <TimeInfo
            type="tournament"
            entity={{
              title: tournament.title,
              spec: tournament.spec,
              creator: tournament.author,
            }}
            timeInfo={{
              start: tournament.start,
              end: tournament.end,
              froze: tournament.frozeResults,
              status: tournament.status.spec as 0 | 1 | 2,
            }}
            refetch={() => {}}
          />
        );
      case "results":
        return (
          <Results
            spec={spec}
            isFinished={tournament.status.spec === 2}
            endDate={tournament.end}
            type="tournament"
            full
            is_team={isTeam}
          />
        );
      case "attempts":
        return (
          <AttemptsList
            type="tournament"
            spec={tournament.spec}
            shouldNotRefetch={tournament.status.spec !== 1}
            isFinished={tournament.status.spec === 2}
            endDate={tournament.end}
          />
        );
      case "participants":
        return (
          <ParticipantsListWithBan
            type="tournament"
            team={isTeam}
            spec={spec}
          />
        );
      case "registration":
        return (
          <RegistrationManagement
            spec={spec}
            maxTeamSize={tournament.maxTeamSize}
          />
        );
      case "create_notification":
        return <CreateNotification spec={tournament.spec} type="tournament" />;
      case "banned_attempts":
        return (
          <AttemptsList
            type="tournament"
            banned
            spec={tournament.spec}
            shouldNotRefetch={tournament.status.spec !== 1}
            isFinished={tournament.status.spec === 2}
            endDate={tournament.end}
          />
        );
      case "settings":
        return <Settings tournament={tournament} />;
      default:
        return null;
    }
  };

  const [activeModal, setActiveModal] = useState(false);

  const { isTeacher } = useUser();
  const { width } = useWidth();

  const actions: IStickyAction[] = [
    {
      color: "green",
      icon: (
        <IconPencil
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/tournament/edit/${spec}`,
      description: locale.tip.sticky.tournament.edit,
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
      description: locale.tip.sticky.tournament.delete,
    },
  ];

  return (
    <>
      {isTeacher && (
        <>
          {tournament && (
            <DeleteModal
              active={activeModal}
              setActive={setActiveModal}
              tournament={tournament}
            />
          )}
          <Sticky actions={actions} />
        </>
      )}
      <LeftMenu links={links}>{renderActivePage()}</LeftMenu>
    </>
  );
};

export default memo(TournamentDashboard);
