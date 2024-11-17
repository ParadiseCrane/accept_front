import Logo from '@components/layout/Navbar/Logo/Logo';
import SignIn from '@components/layout/Navbar/SignIn/SignIn';
import { ITask } from '@custom-types/data/ITask';
import {
  ActionIcon,
  AppShell,
  Burger,
  Center,
  Group,
  Kbd,
  NavLink,
  Text,
  Title,
} from '@mantine/core';
import { useCounter, useDisclosure, useHotkeys } from '@mantine/hooks';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'tabler-icons-react';

interface ICourse {
  spec: string;
  title: string;
  description: string;
  image: string;
  children: ICourse[] | ITask[];
}

function Course(props: { course: ICourse }) {
  const course = props.course;

  const [opened, { toggle }] = useDisclosure();
  const [] = useCounter();
  useHotkeys([
    ['ctrl + ,', () => console.log('prev page')],
    ['ctrl + .', () => console.log('next page')],
  ]);

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
        <AppShell.Header p={'sm'}>
          <Group justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Logo size="sm" />
            </Group>
            <SignIn size="md" />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavLink href="#intro" label="Introduction" />
          <NavLink href="#unit1" label="Unit 1">
            <NavLink href="#lesson1" label="Lesson 1" />
            <NavLink href="#lesson2" label="Lesson 2" />
            <NavLink href="#lesson3" label="Lesson 3">
              <NavLink href="#" label="Task 1" />
              <NavLink href="#" label="Task 2" />
              <NavLink href="#" label="Task 3" />
              <NavLink href="#" label="Task 4" />
            </NavLink>
            <NavLink href="#lesson4" label="Lesson 4" />
          </NavLink>
          <NavLink href="#" label="Unit 2">
            <NavLink href="#" label="Lesson 1" />
            <NavLink href="#" label="Lesson 2" />
            <NavLink href="#" label="Lesson 3" />
          </NavLink>
          <NavLink href="#" label="Unit 3">
            <NavLink href="#" label="Lesson 1" />
            <NavLink href="#" label="Lesson 2" />
            <NavLink href="#" label="Lesson 3" />
          </NavLink>
          <NavLink href="#" label="Unit 4">
            <NavLink href="#" label="Lesson 1" />
            <NavLink href="#" label="Lesson 2" />
            <NavLink href="#" label="Lesson 3" />
          </NavLink>
        </AppShell.Navbar>

        <AppShell.Footer>
          <Group justify="space-between" p={'md'}>
            <Group>
              <ActionIcon>
                <ArrowLeft />
              </ActionIcon>
              <div>
                <Kbd>Ctrl</Kbd> + <Kbd>&lt;</Kbd>
              </div>
            </Group>
            <Group>
              <div>
                <Kbd>Ctrl</Kbd> + <Kbd>&gt;</Kbd>
              </div>
              <ActionIcon>
                <ArrowRight />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Footer>

        <AppShell.Main>
          <Image
            src={course.image}
            alt="Picture of the course"
            width={600}
            height={200}
            sizes="100vw"
            style={{
              width: '100%',
              objectFit: 'cover',
            }}
          />
          <Center>
            <Title order={1}>{course.title}</Title>
          </Center>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
          <Text>{course.description}</Text>
        </AppShell.Main>
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

  let course: ICourse = {
    spec: query.spec,
    title: 'Test course',
    description:
      'During this course we will test all features that are present in Accept courses.',
    image:
      'https://wallpapers.com/images/hd/nice-background-epwgnra8o2fouefa.jpg',
    children: [],
  };

  return {
    props: {
      course,
    },
  };
};
