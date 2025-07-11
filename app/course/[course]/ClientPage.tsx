'use client';

import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import Header from '@components/Course/Header';
import Main from '@components/Course/Main/Main';
import NavBar from '@components/Course/NavBar/NavBar';
import { ICourse, IBaseTreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { useUser } from '@hooks/useUser';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ChatSticky from '@ui/ChatSticky/ChatSticky';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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

export default function CourseClient({
  initialData,
  initialItem,
}: {
  initialData: {
    course: ICourse;
    has_moderate_rights: boolean;
  };
  initialItem: string;
}) {
  const { user } = useUser();
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [course] = useState(initialData.course);
  const [isModerator] = useState(initialData.has_moderate_rights);
  const [isAuthor, setIsAuthor] = useState(false);
  const [itemSpec, setItemSpec] = useState(initialItem);
  const [openModal, setOpenModal] = useState(false);
  const [opened, { toggle }] = useDisclosure();

  const units = useMemo(
    () =>
      flattenCourse({
        course,
        children: course.children,
      }),
    [course]
  );

  const [value, handlers] = useMoveThroughArray(
    units,
    (item, hash) => item.spec == hash,
    (item) => `/course/${course.spec}?item=${item.spec}`
  );

  useEffect(() => {
    if (user && user.login === course.author) {
      setIsAuthor(true);
    }
  }, [user, course.author]);

  useEffect(() => {
    router.replace(`/course/${course.spec}?item=${itemSpec}`);
    handlers.currentByHash(itemSpec);
  }, [course.spec, itemSpec, handlers, router]);

  useEffect(() => {
    const spec = searchParams?.get('item');
    if (spec && spec !== itemSpec) {
      setItemSpec(spec);
      handlers.currentByHash(spec);
    }
  }, [searchParams, itemSpec, handlers]);

  const actions: IStickyAction[] = useMemo(() => {
    const innerActions: IStickyAction[] = [];

    if (isModerator || isAuthor) {
      innerActions.push({
        color: 'grape',
        icon: <Dashboard height={20} width={20} />,
        href:
          value.kind === 'course'
            ? `/dashboard/${value.kind}/${value.spec}`
            : `/dashboard/${value.kind}/${value.spec}?course=${course.spec}`,
        description: locale.tip.sticky.course.dashboard(value.kind),
      });
    }

    if (isAuthor) {
      if (value.kind === 'lesson') {
        innerActions.push({
          color: 'green',
          icon: <PlaylistAdd width={20} height={20} />,
          href: `/task/add?lesson=${value.spec}`,
          description: locale.tip.sticky.course.createTask,
        });
      }
      innerActions.push(
        {
          color: 'green',
          href: `/course/edit/${course.spec}?item=${value.spec}`,
          icon: <Pencil height={20} width={20} />,
          description: locale.tip.sticky.course.edit(value.kind),
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
  }, [isModerator, isAuthor, value, course, locale]);

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
        hookUnit={value}
        image={course.image}
        prev={handlers.prev}
        next={handlers.next}
      />
      <Main key={value.spec} />
      {actions.length > 0 && isAuthor && <Sticky actions={actions} />}
      {isModerator && !isAuthor && (
        <SingularSticky
          color="grape"
          href={
            value.kind === 'course'
              ? `/dashboard/${value.kind}/${value.spec}`
              : `/dashboard/${value.kind}/${value.spec}?course=${course.spec}`
          }
          icon={<Dashboard height={25} width={25} />}
          description={locale.tip.sticky.course.dashboard(value.kind)}
        />
      )}
      <DeleteModal
        active={openModal}
        setActive={setOpenModal}
        course={course}
      />
      {user && !isModerator && !isAuthor && (
        <ChatSticky entity={'course'} spec={course.spec} host={user.login} />
      )}
    </AppShell>
  );
}
