"use client";
import AttemptsList from "@components/Dashboard/AttemptsList/AttemptsList";
import TimeInfo from "@components/Dashboard/TimeInfo/TimeInfo";
import DeleteModal from "@components/Tournament/DeleteModal/DeleteModal";
import { STICKY_SIZES } from "@constants/Sizes";
import { ITournament } from "@custom-types/data/ITournament";
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

const TournamentDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();

  const [tournament, setTournament] = useState<ITournament>();

  const { data, refetch } = useRequest<undefined, ITournament>(
    `tournament/${spec}`,
    "GET",
  );

  // AI-FEATURE FLAG
  // const { data: aiCount } = useRequest<undefined, number>(
  //   `tournament/attempts/ai/count/${spec}`,
  //   "GET",
  // );

  const refetchTournament = useInterval(() => refetch(false), 60 * 1000);

  useEffect(() => {
    refetchTournament.start();
    return refetchTournament.stop;
  }, []); // eslint-disable-line

  useEffect(() => {
    if (data) setTournament(data);
  }, [data]);

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links = [
      {
        page: tournament && (
          <TimeInfo
            type={"tournament"}
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
            refetch={() => refetch(false)}
          />
        ),
        icon: <IconVocabulary color="var(--secondary)" />,
        title: locale.dashboard.tournament.mainInfo,
        section: "tournament",
      },
      {
        page: <ChatPage spec={spec} entity="tournament" />,
        icon: (
          <Indicator
            disabled={!hasNewMessages}
            size={20}
            inline
            offset={0}
            zIndex={100}
            processing
            color="var(--accent)"
            label={"New"}
          >
            <IconMessages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.tournament.chat,
        section: "chat",
      },
      {
        page: tournament && (
          <Results
            spec={spec}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
            type={"tournament"}
            full
            is_team={tournament.maxTeamSize != 1}
          />
        ),
        icon: <IconTable color="var(--secondary)" />,
        title: locale.dashboard.tournament.results,
        section: "results",
      },
      {
        page: tournament && (
          <AttemptsList
            key={"all"}
            type={"tournament"}
            spec={tournament.spec}
            shouldNotRefetch={tournament.status.spec != 1}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
          />
        ),
        icon: <IconAlignRight color="var(--secondary)" />,
        title: locale.dashboard.tournament.attempts,
        section: "attempts",
      },
      // AI-FEATURE FLAG
      // {
      //   page: tournament && (
      //     <AIProbabilityList
      //       key={"all"}
      //       type={"tournament"}
      //       spec={tournament.spec}
      //       shouldNotRefetch={tournament.status.spec != 1}
      //     />
      //   ),
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
        page: (
          <ParticipantsListWithBan
            type={"tournament"}
            team={tournament?.maxTeamSize != 1}
            spec={spec}
          />
        ),
        icon: <IconUsers color="var(--secondary)" />,
        title: locale.dashboard.tournament.participants,
        section: "participants",
      },
      {
        page: <TaskList type={"tournament"} spec={spec} />,
        icon: <IconPuzzle color="var(--secondary)" />,
        title: locale.dashboard.tournament.tasks,
        section: "tasks",
      },
      {
        page: (
          <RegistrationManagement
            spec={spec}
            maxTeamSize={tournament?.maxTeamSize || 1}
          />
        ),
        icon: <IconAddressBook color="var(--secondary)" />,
        title: locale.dashboard.tournament.registrationManagement,
        section: "registration",
      },
      {
        page: tournament && (
          <CreateNotification spec={tournament.spec} type="tournament" />
        ),
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.dashboard.tournament.createNotification,
        section: "create_notification",
      },
      {
        page: tournament && (
          <AttemptsList
            key={"banned"}
            type={"tournament"}
            banned
            spec={tournament.spec}
            shouldNotRefetch={tournament.status.spec != 1}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
          />
        ),
        icon: <IconBan color="var(--secondary)" />,
        title: locale.dashboard.tournament.bannedAttempts,
        section: "banned_attempts",
      },
      {
        page: tournament && <Settings tournament={tournament} />,
        icon: <SettingsIcon color="var(--secondary)" />,
        title: locale.dashboard.tournament.settings.self,
        section: "settings",
      },
    ];

    if (tournament?.maxTeamSize != 1) {
      links.splice(4, 0, {
        page: <TeamList spec={spec} />,
        icon: <IconUsers color="var(--secondary)" />,
        title: locale.dashboard.tournament.teams,
        section: "teams",
      });
    }

    return links;
  }, [tournament, hasNewMessages, locale, refetch, spec]);

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
      <LeftMenu links={links} />
    </>
  );
};

export default memo(TournamentDashboard);
