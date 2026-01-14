"use client";

import DeleteModal from "@components/Course/DeleteModal/DeleteModal";
import Header from "@components/Course/Header";
import Main from "@components/Course/Main/Main";
import NavBar from "@components/Course/NavBar/NavBar";
import {
  ICourse,
  IBaseTreeUnit,
  IUnit,
  ILesson,
} from "@custom-types/data/ICourse";
import { useCourse } from "@hooks/useCourse";
import { useLocale } from "@hooks/useLocale";
import { useMoveThroughArray } from "@hooks/useStateHistory";
import { useUser } from "@hooks/useUser";
import { Affix, AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ChatSticky from "@ui/ChatSticky/ChatSticky";
import SingularSticky from "@ui/Sticky/SingularSticky";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  IconDashboard,
  IconPencil,
  IconPlaylistAdd,
  IconTrash,
} from "@tabler/icons-react";

const flattenCourse = ({
  course,
  children,
}: {
  course: ICourse;
  children: IBaseTreeUnit[];
}): IBaseTreeUnit[] => {
  const courseAsUnit: IBaseTreeUnit = {
    kind: course.kind,
    order: "0",
    spec: course.spec,
    title: course.title,
  };
  return [courseAsUnit, ...children];
};

export default function CourseClient({
  spec,
  item,
}: {
  spec: string;
  item: ICourse | IUnit | ILesson;
}) {
  const { user } = useUser();
  const { locale } = useLocale();
  const router = useRouter();
  let { course, isModerator, isAuthor } = useCourse();

  const [openModal, setOpenModal] = useState(false);
  const [opened, { toggle, close }] = useDisclosure();

  const units = useMemo(
    () =>
      (course &&
        flattenCourse({
          course,
          children: course.children,
        })) ||
      [],
    [course],
  );
  const changeHash = useCallback(
    (newItem: IBaseTreeUnit) =>
      router.push(`/course/${spec}?item=${newItem.spec}`),
    [spec, router],
  );

  const [currentUnit, handlers] = useMoveThroughArray(
    units.findIndex((unit) => unit.spec == item.spec),
    units,
    (item1, item2) => item1.spec == item2.spec,
    changeHash,
  );

  const dashboardLink = useMemo(
    () =>
      currentUnit.kind
        ? `/course/${spec}/dashboard/${currentUnit.kind}/${currentUnit.spec}`
        : `/course/${spec}/dashboard/course`,
    [spec, currentUnit],
  );

  const actions: IStickyAction[] = useMemo(() => {
    const innerActions: IStickyAction[] = [];

    if (isModerator || isAuthor) {
      innerActions.push({
        color: "grape",
        icon: <IconDashboard height={20} width={20} />,
        href: dashboardLink,
        description: locale.tip.sticky.course.dashboard(currentUnit.kind),
      });
    }

    if (isAuthor) {
      if (currentUnit.kind === "lesson") {
        innerActions.push({
          color: "green",
          icon: <IconPlaylistAdd width={20} height={20} />,
          href: `/task/add?lesson=${currentUnit.spec}`,
          description: locale.tip.sticky.course.createTask,
        });
      }
      innerActions.push(
        {
          color: "green",
          href: `/course/${spec}/edit/${currentUnit.spec}`,
          icon: <IconPencil height={20} width={20} />,
          description: locale.tip.sticky.course.edit(currentUnit.kind),
        },
        {
          color: "red",
          onClick: () => setOpenModal(true),
          icon: <IconTrash height={20} width={20} />,
          description: locale.tip.sticky.course.delete,
        },
      );
    }

    return innerActions;
  }, [isModerator, isAuthor, currentUnit, locale, spec, dashboardLink]);

  if (!course) return null;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <Header opened={opened} toggle={toggle} />
      <NavBar
        units={units}
        hookUnit={currentUnit}
        image={course?.image}
        prev={() => {
          handlers.prev();
          close();
        }}
        next={() => {
          handlers.next();
          close();
        }}
        select={(e) => {
          handlers.current(e);
          close();
        }}
        navbarOpened={opened}
      />
      <Main
        units={units}
        courseSpec={course.spec}
        select={(e) => {
          handlers.current(e);
          close();
        }}
      />
      {actions.length > 0 && isAuthor && <Sticky actions={actions} />}
      {isModerator && !isAuthor && (
        <SingularSticky
          color="grape"
          href={dashboardLink}
          icon={<IconDashboard height={25} width={25} />}
          description={locale.tip.sticky.course.dashboard(currentUnit.kind)}
        />
      )}
      {course && (
        <DeleteModal
          active={openModal}
          setActive={setOpenModal}
          course={course}
        />
      )}
      {user && !isModerator && !isAuthor && (
        <ChatSticky entity={"course"} spec={spec} host={user.login} />
      )}
    </AppShell>
  );
}
