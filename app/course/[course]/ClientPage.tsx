'use client';

import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import Header from '@components/Course/Header';
import Main from '@components/Course/Main/Main';
import NavBar from '@components/Course/NavBar/NavBar';
import { ICourse, IBaseTreeUnit } from '@custom-types/data/ICourse';
import { useCourse } from '@hooks/useCourse';
import { useLocale } from '@hooks/useLocale';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { useUser } from '@hooks/useUser';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ChatSticky from '@ui/ChatSticky/ChatSticky';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dashboard, Pencil, PlaylistAdd, Trash } from 'tabler-icons-react';

const flattenCourse = ({
  course,
  children,
}: {
  course: ICourse;
  children: IBaseTreeUnit[];
}): IBaseTreeUnit[] => {
  const courseAsUnit: IBaseTreeUnit = {
    kind: course.kind,
    order: '0',
    spec: course.spec,
    title: course.title,
  };
  return [courseAsUnit, ...children];
};

export default function CourseClient({ spec }: { spec: string }) {
  const { user } = useUser();
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  let { course, isModerator, isAuthor } = useCourse();

  const item: string = useMemo(
    () => searchParams?.get('item') || spec,
    [searchParams, spec]
  );
  const [openModal, setOpenModal] = useState(false);
  const [opened, { toggle }] = useDisclosure();

  const units = useMemo(
    () =>
      (course &&
        flattenCourse({
          course,
          children: course.children,
        })) ||
      [],
    [course]
  );
  const changeHash = useCallback(
    (newItem: IBaseTreeUnit) =>
      router.push(`/course/${spec}?item=${newItem.spec}`),
    [spec, router]
  );

  const [currentUnit, handlers] = useMoveThroughArray(
    units.findIndex((unit) => unit.spec == item),
    units,
    (item1, item2) => item1.spec == item2.spec,
    changeHash
  );

  const dashboardLink = useMemo(
    () =>
      currentUnit.kind == 'course'
        ? `/course/${spec}/dashboard/course`
        : `/course/${spec}/dashboard/${currentUnit.kind}/${currentUnit.spec}`,
    [spec, currentUnit]
  );

  const actions: IStickyAction[] = useMemo(() => {
    const innerActions: IStickyAction[] = [];

    if (isModerator || isAuthor) {
      innerActions.push({
        color: 'grape',
        icon: <Dashboard height={20} width={20} />,
        href: dashboardLink,
        description: locale.tip.sticky.course.dashboard(currentUnit.kind),
      });
    }

    if (isAuthor) {
      if (currentUnit.kind === 'lesson') {
        innerActions.push({
          color: 'green',
          icon: <PlaylistAdd width={20} height={20} />,
          href: `/task/add?lesson=${currentUnit.spec}`,
          description: locale.tip.sticky.course.createTask,
        });
      }
      innerActions.push(
        {
          color: 'green',
          href: `/course/${spec}/edit/${currentUnit.spec}`,
          icon: <Pencil height={20} width={20} />,
          description: locale.tip.sticky.course.edit(currentUnit.kind),
        },
        {
          color: 'red',
          onClick: () => setOpenModal(true),
          icon: <Trash height={20} width={20} />,
          description: locale.tip.sticky.course.delete,
        }
      );
    }

    return innerActions;
  }, [isModerator, isAuthor, currentUnit, locale, spec, dashboardLink]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      footer={{ offset: true, height: 60 }}
      padding="md"
      layout="alt"
    >
      <Header opened={opened} toggle={toggle} />
      <NavBar
        units={units}
        hookUnit={currentUnit}
        image={course?.image}
        prev={handlers.prev}
        next={handlers.next}
        select={handlers.current}
      />
      <Main key={currentUnit.spec} />
      {actions.length > 0 && isAuthor && <Sticky actions={actions} />}
      {isModerator && !isAuthor && (
        <SingularSticky
          color="grape"
          href={`/course/${spec}/dashboard/${currentUnit.kind}/${currentUnit.spec}`}
          icon={<Dashboard height={25} width={25} />}
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
        <ChatSticky entity={'course'} spec={spec} host={user.login} />
      )}
    </AppShell>
  );
}
