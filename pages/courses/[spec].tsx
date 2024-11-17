import Footer from '@components/Courses/Footer';
import Header from '@components/Courses/Header';
import Main from '@components/Courses/Main';
import NavBar from '@components/Courses/NavBar';
import { ICourse } from '@custom-types/data/ICourse';
import { ITask } from '@custom-types/data/ITask';
import { useMoveThroughArray } from '@hooks/useStateHistory';
import { AppShell } from '@mantine/core';
import { useDisclosure, useHash, useIsFirstRender } from '@mantine/hooks';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

const flattenCourse = (item: ICourse | ITask): (ICourse | ITask)[] => {
  if (!('children' in item)) return [item];
  let specs: (ICourse | ITask)[] = [item];
  for (var i = 0; i < item.children.length; i++) {
    specs = specs.concat(flattenCourse(item.children[i]));
  }
  return specs;
};

function Course(props: { course: ICourse }) {
  const course = props.course;

  const [opened, { toggle }] = useDisclosure();
  const [value, handlers, array] = useMoveThroughArray(
    flattenCourse(course),
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
        <NavBar course={course} />
        <Footer prev={handlers.prev} next={handlers.next} />

        <Main key={hash} course={value} />
      </AppShell>
    </>
  );
}

export default Course;

const generateLesson = (
  unit: number,
  index: number,
  tasks: number
): ICourse => ({
  spec: `${Math.floor(Math.random() * 1000)}`,
  title: `Lesson ${index + 1}`,
  description: `Description of unit ${unit + 1} lesson ${index + 1}`,
  image: '',
  children: [],
});

const generateUnit = (index: number): ICourse => ({
  spec: `${Math.floor(Math.random() * 1000)}`,
  title: `Unit ${index + 1}`,
  description: `Description of unit ${index + 1}`,
  image: '',
  children: Array.apply(null, Array(5)).map((x, i) =>
    generateLesson(index, i, 3)
  ),
});

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

  let units: ICourse[] = Array.apply(null, Array(5)).map((x, i) =>
    generateUnit(i)
  );

  let course: ICourse = {
    spec: query.spec,
    title: 'Test course',
    description:
      'During this course we will test all features that are present in Accept courses.',
    image:
      'https://wallpapers.com/images/hd/nice-background-epwgnra8o2fouefa.jpg',
    children: units,
  };

  return {
    props: {
      course,
    },
  };
};
