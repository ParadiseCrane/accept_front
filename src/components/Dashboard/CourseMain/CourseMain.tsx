import { FC, memo, useEffect, useState } from 'react';
import { Center, Title, Image } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { ICourse, ICourseMain } from '@custom-types/data/ICourse';
import { useSearchParams } from 'next/navigation';
import { sendRequest } from '@requests/request';
import tableStyles from '@styles/ui/customTable.module.css';
import Link from 'next/link';

const CourseMain: FC<{ spec: string }> = ({ spec }) => {
  const [course, setCourse] = useState<ICourseMain | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('group')) {
      setLoading(true);
      sendRequest<{}, ICourse>(`course/${spec}`, 'GET', undefined).then(
        (courseRes) => {
          if (!courseRes.error) {
            sendRequest<{}, string>(
              `invite/${spec}/${params.get('group')}`,
              'POST'
            ).then((inviteRes) => {
              if (!inviteRes.error) {
                setCourse({
                  title: courseRes.response.title,
                  description: courseRes.response.description,
                  image: courseRes.response.image,
                  invite: inviteRes.response,
                });
                setLoading(false);
              }
            });
          }
        }
      );
    }
  }, [params]);

  if (!course || loading) {
    return <div></div>;
  }

  return (
    <>
      {course.image.length > 0 && (
        <Image
          src={`/api/image/${course.image}`}
          alt="Picture of the course"
          width={600}
          height={200}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: 200,
            objectFit: 'cover',
          }}
        />
      )}
      <Center>
        <Title order={1}>{course.title}</Title>
      </Center>
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${course.invite}`}
        className={tableStyles.title}
      >
        {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${course.invite}`}
      </Link>
      <TipTapEditor
        editorMode={false}
        content={course.description}
        onUpdate={() => {}}
      />
    </>
  );
};

export default memo(CourseMain);
