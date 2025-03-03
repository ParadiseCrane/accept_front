import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import Header from '@components/Course/Header';
import Main from '@components/Course/Main/Main';
import NavBar from '@components/Course/NavBar/NavBar';
import { ICourseModel, IUnit } from '@custom-types/data/ICourse';
import { IRightsPayload } from '@custom-types/data/rights';
import { useLocale } from '@hooks/useLocale';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { useUser } from '@hooks/useUser';
import { AppShell } from '@mantine/core';
import { useDisclosure, useHash } from '@mantine/hooks';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { Dashboard, Pencil, Trash } from 'tabler-icons-react';

const flattenCourse = ({
  course,
  children,
}: {
  course: ICourseModel;
  children: IUnit[];
}): IUnit[] => {
  const courseAsUnit: IUnit = {
    kind: course.kind,
    order: '0',
    spec: course.spec,
    title: course.title,
  };
  let units: IUnit[] = [courseAsUnit];
  if (children.length === 0) return units;
  for (var i = 0; i < children.length; i++) {
    units = [...units, children[i]];
  }
  return units;
};

function Course(props: { course: ICourseModel; has_moderate_rights: boolean }) {
  const { user } = useUser();
  const course = props.course;
  const isModerator = props.has_moderate_rights;
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const units: IUnit[] = flattenCourse({
    course: course,
    children: course.children,
  });
  const [openModal, setOpenModal] = useState(false);

  const [opened, { toggle }] = useDisclosure();
  const [value, handlers, array] = useMoveThroughArray(
    units,
    (item, hash) => item.spec == hash
  );
  const [hash, setHash] = useHash();
  const { locale } = useLocale();

  useEffect(() => {
    handlers.currentByHash(hash.slice(1));
  }, [hash]);

  useEffect(() => {
    if (!!value && value.spec !== hash.slice(1)) setHash(value.spec);
  }, [value]);

  useEffect(() => {
    if (user && user.login === course.author) {
      setIsAuthor(true);
    }
    console.log('user login', user?.login);
    console.log('author login', course.author);
  }, [user]);

  const actions: IStickyAction[] = useMemo(() => {
    const innerActions: IStickyAction[] = [];

    if (isModerator || isAuthor) {
      innerActions.push({
        color: 'grape',
        icon: <Dashboard height={20} width={20} />,
        href: `/dashboard/course/${course.spec}`,
        description: locale.tip.sticky.course.dashboard,
      });
    }

    if (isAuthor && value.kind === 'course') {
      innerActions.push(
        {
          color: 'green',
          href: `/course/edit/${course.spec}`,
          icon: <Pencil height={20} width={20} />,
          description: locale.tip.sticky.course.edit,
        },
        {
          color: 'red',
          onClick: () => {
            setOpenModal(true);
          },
          icon: <Trash height={20} width={20} />,
          description: locale.tip.sticky.course.delete,
        }
      );
    }

    if (isAuthor && value.kind === 'unit') {
      innerActions.push({
        color: 'green',
        href: `/course/edit/${course.spec}?unit=${value.spec}`,
        icon: <Pencil height={20} width={20} />,
        description: locale.tip.sticky.course.editUnit,
      });
    }

    return innerActions;
  }, [isModerator, value, isAuthor]);

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
        <NavBar
          units={units}
          hookUnit={value}
          image={course.image}
          prev={handlers.prev}
          next={handlers.next}
        />
        <Main key={hash} />
        {(value.kind == 'course' || value.kind == 'unit') &&
          actions.length > 0 && <Sticky actions={actions} />}
        <DeleteModal
          active={openModal}
          setActive={setOpenModal}
          course={course}
        />
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
      redirect: {
        permanent: false,
        destination: '/404',
      },
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

    return {
      props: {
        course,
        has_moderate_rights: hasModerateRights,
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
