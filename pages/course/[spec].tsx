import Footer from '@components/Course/Footer';
import Header from '@components/Course/Header';
import Main from '@components/Course/Main';
import NavBar from '@components/Course/NavBar';
import { ICourseModel, IUnit } from '@custom-types/data/ICourse';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { AppShell } from '@mantine/core';
import { useDisclosure, useHash } from '@mantine/hooks';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

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
  const units: IUnit[] = flattenCourse({
    course: course,
    children: course.children,
  });

  const [opened, { toggle }] = useDisclosure();
  const [value, handlers, array] = useMoveThroughArray(
    units,
    (item, hash) => item.spec == hash
  );
  const [hash, setHash] = useHash();

  useEffect(() => {
    handlers.currentByHash(hash.slice(1));
  }, [hash]);

  useEffect(() => {
    if (!!value && value.spec !== hash.slice(1)) setHash(value.spec);
  }, [value]);

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
        <NavBar units={units} />
        <Footer prev={handlers.prev} next={handlers.next} />

        <Main key={hash} />
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
