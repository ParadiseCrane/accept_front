import { FC, memo, useEffect, useState } from 'react';
import { Center, Title, Image, Skeleton } from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { ICourseMain, ICourseModel } from '@custom-types/data/ICourse';
import { useSearchParams } from 'next/navigation';
import { sendRequest } from '@requests/request';
import tableStyles from '@styles/ui/customTable.module.css';
import Link from 'next/link';
import { IGroupInvite } from '@custom-types/data/IGroup';
import { LinkCopy } from '@ui/LinkCopy/LinkCopy';

const CourseMain: FC<{
  courseProps: ICourseModel | undefined;
}> = ({ courseProps }) => {
  const [course, setCourse] = useState<ICourseMain | undefined>();
  const [linkLoading, setLinkLoading] = useState<boolean>(true);
  const params = useSearchParams();

  const fetchData = async () => {
    if (courseProps) {
      setCourse({
        title: courseProps.title,
        description: courseProps.description,
        image: courseProps.image,
      });
      if (params.get('group') && params.get('group') !== 'all') {
        const inviteRes = await sendRequest<{}, IGroupInvite[]>(
          `invite/${courseProps.spec}/${params.get('group')}`,
          'GET'
        );
        if (!inviteRes.error) {
          setCourse({
            title: courseProps.title,
            description: courseProps.description,
            image: courseProps.image,
            invite: inviteRes.response[0].invite_spec,
          });
        }
      }
      setLinkLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseProps, params]);

  if (!course) {
    return <></>;
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

      <Skeleton visible={linkLoading}>
        {course.invite ? (
          <LinkCopy inviteSpec={course.invite} />
        ) : (
          // <Link
          //   href={`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${course.invite}`}
          //   className={tableStyles.title}
          // >
          //   {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${course.invite}`}
          // </Link>
          <div>Нет ссылки-приглашения</div>
        )}
      </Skeleton>
      <TipTapEditor
        editorMode={false}
        content={course.description}
        onUpdate={() => {}}
      />
    </>
  );
};

export default memo(CourseMain);
