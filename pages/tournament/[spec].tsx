"use client";
import DeleteModal from "@components/Tournament/DeleteModal/DeleteModal";
import Description from "@components/Tournament/Description/Description";
import PinModal from "@components/Tournament/PinModal/PinModal";
import { STICKY_SIZES } from "@constants/Sizes";
import { ITournament } from "@custom-types/data/ITournament";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { useWidth } from "@hooks/useWidth";
import { DefaultLayout } from "@layouts/DefaultLayout";
import ChatSticky from "@ui/ChatSticky/ChatSticky";
import SingularSticky from "@ui/Sticky/SingularSticky";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";
import Timer from "@ui/Timer/Timer";
import Title from "@ui/Title/Title";
import { getCookieValue } from "@utils/cookies";
import { getApiUrl } from "@utils/getServerUrl";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  IconDashboard,
  IconKey,
  IconPencil,
  IconPlaylistAdd,
  IconReportAnalytics,
  IconShirtSport,
  IconTrash,
} from "@tabler/icons-react";
import { useRequest } from "@hooks/useRequest";

interface UserState {
  is_participant: boolean;
  team_spec?: string;
  special: boolean;
}

function Tournament(props: { tournament: ITournament }) {
  const tournament = props.tournament;
  const [activeDeleteModal, setActiveDeleteModal] = useState(false);
  const [activePinModal, setActivePinModal] = useState(false);
  const { locale } = useLocale();

  const { user } = useUser();
  const { width } = useWidth();

  const { data: userState } = useRequest<{}, UserState>(
    `/tournament/user-state/${tournament.spec}`,
    "GET",
  );

  const is_participant = userState?.is_participant || false;
  const team_spec = userState?.team_spec;
  const special = userState?.special || false;

  const actions: IStickyAction[] = useMemo(
    () => [
      {
        color: "grape",
        icon: (
          <IconDashboard
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        href: `/dashboard/tournament/${tournament.spec}`,
        description: locale.tip.sticky.tournament.dashboard,
      },
      {
        color: "blue",
        icon: (
          <IconKey
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        onClick: () => setActivePinModal(true),
        description: locale.tip.sticky.tournament.pin,
        hide: tournament.security != 1,
      },
      {
        color: "green",
        icon: (
          <IconPlaylistAdd
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        href: `/task/add?tournament=${tournament.spec}`,
        description: locale.tip.sticky.task.add,
      },

      {
        color: "green",
        icon: (
          <IconPencil
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        href: `/tournament/edit/${tournament.spec}`,
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
        onClick: () => setActiveDeleteModal(true),
        description: locale.tip.sticky.tournament.delete,
      },
    ],
    [locale, tournament.spec, width, tournament.security],
  );

  const getSticky = useCallback(() => {
    if (special)
      return (
        <>
          <DeleteModal
            active={activeDeleteModal}
            setActive={setActiveDeleteModal}
            tournament={tournament}
          />
          {tournament.security == 1 && (
            <PinModal
              active={activePinModal}
              setActive={setActivePinModal}
              origin={tournament.spec}
            />
          )}
          <Sticky actions={actions} />
        </>
      );

    if (is_participant && tournament.maxTeamSize > 1)
      return (
        <Sticky
          actions={[
            {
              color: "green",
              icon: (
                <IconReportAnalytics
                  width={STICKY_SIZES[width] / 3}
                  height={STICKY_SIZES[width] / 3}
                />
              ),
              href: `/tournament/results/${tournament.spec}`,
              description: locale.tip.sticky.tournament.results,
            },
            {
              color: "blue",
              icon: (
                <IconShirtSport
                  width={STICKY_SIZES[width] / 3}
                  height={STICKY_SIZES[width] / 3}
                />
              ),
              href: `/team/${team_spec}`,
              description: locale.tip.sticky.tournament.myTeam,
            },
          ]}
        />
      );
    if (is_participant && tournament.status.spec != 0)
      return (
        <SingularSticky
          icon={
            <IconReportAnalytics
              width={STICKY_SIZES[width] / 2}
              height={STICKY_SIZES[width] / 2}
            />
          }
          href={`/tournament/results/${tournament.spec}`}
          description={locale.tip.sticky.tournament.results}
        />
      );

    return <></>;
  }, [
    actions,
    activeDeleteModal,
    activePinModal,
    is_participant,
    locale,
    special,
    tournament,
    width,
    team_spec,
  ]);

  return (
    <>
      <Title title={`${locale.titles.tournament.spec} ${tournament.title}`} />
      {getSticky()}
      {user && (special || is_participant) && (
        <ChatSticky
          entity={"tournament"}
          spec={tournament.spec}
          host={user.login}
        />
      )}
      <Timer url={`tournament/info/${tournament.spec}`} />
      <Description tournament={tournament} is_participant={is_participant} />
    </>
  );
}

Tournament.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Tournament;

const API_URL = getApiUrl();

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const spec = params?.spec as string;
  // Static tournament data (no auth)
  const res = await fetch(`${API_URL}/api/tournament/${spec}`);
  if (!res.ok) return { notFound: true };
  const tournament = await res.json();

  return {
    props: { tournament },
    revalidate: 60,
  };
};
