'use client';
import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import Header from '@components/Course/Header';
import Main from '@components/Course/Main/Main';
import NavBar from '@components/Course/NavBar/NavBar';
import { ICourse, IBaseTreeUnit } from '@custom-types/data/ICourse';
import { IRightsPayload } from '@custom-types/data/rights';
import { useLocale } from '@hooks/useLocale';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { useUser } from '@hooks/useUser';
import { AppShell } from '@mantine/core';
import { useDisclosure, useHash } from '@mantine/hooks';
import ChatSticky from '@ui/ChatSticky/ChatSticky';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  IconDashboard,
  IconPencil,
  IconPlaylistAdd,
  IconTrash,
} from '@tabler/icons-react';

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
  let units: IBaseTreeUnit[] = [courseAsUnit];
  if (children.length === 0) return units;
  for (var i = 0; i < children.length; i++) {
    units = [...units, children[i]];
  }
  return units;
};

function Course(props: {
  course: ICourse;
  has_moderate_rights: boolean;
  item: string;
}) {
  const { user } = useUser();
  const course = props.course;
  const isModerator = props.has_moderate_rights === true;
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const units: IBaseTreeUnit[] = flattenCourse({
    course: course,
    children: course.children,
  });
  const [openModal, setOpenModal] = useState(false);
  const [itemSpec, setItemSpec] = useState(props.item);

  const [opened, { toggle }] = useDisclosure();
  const [value, handlers] = useMoveThroughArray(
    0,
    units,
    (item1, item2) => item1.spec == item2.spec,
    (item) => `/course/${course.spec}?item=${item.spec}`
  );
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (user && user.login === course.author) {
      setIsAuthor(true);
    }
  }, [user, course]);

  const actions: IStickyAction[] = useMemo(() => {
    const innerActions: IStickyAction[] = [];

    if (isModerator || isAuthor) {
      innerActions.push({
        color: 'grape',
        icon: <IconDashboard height={20} width={20} />,
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
          icon: <IconPlaylistAdd width={20} height={20} />,
          href: `/task/add?lesson=${value.spec}`,
          description: locale.tip.sticky.course.createTask,
        });
      }
      innerActions.push(
        {
          color: 'green',
          href: `/course/edit/${course.spec}?item=${value.spec}`,
          icon: <IconPencil height={20} width={20} />,
          description: locale.tip.sticky.course.edit(value.kind),
        },
        {
          color: 'red',
          onClick: () => {
            setOpenModal(true);
          },
          icon: <IconTrash height={20} width={20} />,
          description: locale.tip.sticky.course.delete,
        }
      );
    }

    return innerActions;
  }, [isModerator, isAuthor, value, course, locale]);

  return (
    <>
      <Head>
        <title>{course.title}</title>
      </Head>
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
        {/* <Main key={value.spec} /> */}
        {actions.length > 0 && isAuthor && <Sticky actions={actions} />}
        {isModerator && !isAuthor && (
          <SingularSticky
            color="grape"
            href={
              value.kind === 'course'
                ? `/dashboard/${value.kind}/${value.spec}`
                : `/dashboard/${value.kind}/${value.spec}?course=${course.spec}`
            }
            icon={<IconDashboard height={25} width={25} />}
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
    </>
  );
}

export default Course;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      notFound: true,
    };
  }

  const response = await fetchWrapperStatic({
    url: `course/course_navigation_tree/${query.spec}`,
    req,
  });

  const courseResponse = await fetchWrapperStatic({
    url: `course/${query.spec}`,
    req,
  });

  const moderateRightsBody: IRightsPayload = {
    action: 'moderate',
    entity_spec: query.spec,
    entity: 'course',
  };

  const hasModerateRightsResponse = await fetchWrapperStatic({
    url: 'rights',
    req,
    method: 'POST',
    body: moderateRightsBody,
  });

  if (response.status === 200) {
    const json = await response.json();
    const hasModerateRights = await hasModerateRightsResponse.json();
    const author = (await courseResponse.json()).author;
    const course = {
      ...json,
      author: author,
      spec: query.spec,
    };

    if (course.kind !== 'course') {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        course,
        has_moderate_rights: hasModerateRights,
        item: query.item && query.item.length > 0 ? query.item : query.spec,
      },
    };
  }
  return {
    notFound: true,
  };
};
