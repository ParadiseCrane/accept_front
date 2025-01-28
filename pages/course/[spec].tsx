import Footer from '@components/Course/Footer';
import Header from '@components/Course/Header';
import Main from '@components/Course/Main';
import NavBar from '@components/Course/NavBar';
import { STICKY_SIZES } from '@constants/Sizes';
import { ICourseModel, IUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { useWidth } from '@hooks/useWidth';
import { AppShell } from '@mantine/core';
import { useDisclosure, useHash } from '@mantine/hooks';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dashboard, Key, Pencil, Trash } from 'tabler-icons-react';

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

function Course(props: { course: ICourseModel }) {
  const course = props.course;
  // TODO добавить реальные данные
  // const hasWriteRights = props.has_write_rights;
  const hasWriteRights = true;
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
  const { width } = useWidth();
  const { locale } = useLocale();

  useEffect(() => {
    handlers.currentByHash(hash.slice(1));
  }, [hash]);

  useEffect(() => {
    if (!!value && value.spec !== hash.slice(1)) setHash(value.spec);
  }, [value]);

  const actions: IStickyAction[] = useMemo(
    () =>
      hasWriteRights
        ? [
            {
              color: 'grape',
              icon: <Dashboard height={20} width={20} />,
              href: `/dashboard/course/${course.spec}`,
              description: locale.tip.sticky.course.dashboard,
            },
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
            },
          ]
        : [],

    [hasWriteRights]
  );

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
        <NavBar units={units} hookUnit={value} image={course.image} />
        <Footer prev={handlers.prev} next={handlers.next} />

        <Main key={hash} />
        {value.spec === course.spec && actions.length > 0 && (
          <Sticky actions={actions} />
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
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  const response = await fetchWrapperStatic({
    url: `course-edit/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const json = await response.json();
    const course = {
      ...json,
      spec: query.spec,
    };

    return {
      props: {
        course,
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
