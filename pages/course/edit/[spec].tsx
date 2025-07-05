import CourseEditPage from '@components/Course/Edit/CourseEditPage';
import LessonEditPage from '@components/Course/Edit/LessonEditPage';
import UnitEditPage from '@components/Course/Edit/UnitEditPage';
import { ICourse, IUnit, ILesson } from '@custom-types/data/ICourse';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

function CourseEdit(props: {
  course: ICourse | IUnit | ILesson;
  depth: number;
}) {
  if (props.course.kind === 'course')
    return <CourseEditPage course={props.course} depth={props.depth} />;

  if (props.course.kind === 'unit')
    return <UnitEditPage course={props.course} depth={props.depth} />;

  return <LessonEditPage course={props.course} depth={props.depth} />;
}

CourseEdit.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseEdit;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      notFound: true,
    };
  }

  const spec = `${req.url?.split('?item=').pop()!.split('&spec')[0]}`;

  const response = await fetchWrapperStatic({
    url: `course-edit/${spec}`,
    req,
  });

  if (response.status === 200) {
    const entity: { course: ICourse | IUnit | ILesson; depth: number } =
      await response.json();

    return {
      props: { ...entity, course: { ...entity.course, spec } },
    };
  }
  return {
    notFound: true,
  };
};
