import { FC, memo, useEffect, useState } from 'react';
import {
  Center,
  Title,
  Image,
  Skeleton,
  Box,
  Divider,
  Paper,
} from '@mantine/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { ICourseMain, ICourseModel } from '@custom-types/data/ICourse';
import { useSearchParams } from 'next/navigation';
import { sendRequest } from '@requests/request';
import tableStyles from '@styles/ui/customTable.module.css';
import Link from 'next/link';
import { IGroupInvite } from '@custom-types/data/IGroup';
import { LinkCopy } from '@ui/LinkCopy/LinkCopy';
import { useLocale } from '@hooks/useLocale';

const CourseMain: FC<{
  courseProps: ICourseModel | undefined;
}> = ({ courseProps }) => {
  const [course, setCourse] = useState<ICourseMain | undefined>();
  const [linkLoading, setLinkLoading] = useState<boolean>(true);
  const params = useSearchParams();
  const { locale } = useLocale();

  const fetchData = async () => {
    setLinkLoading(true);
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLinkLoading(false);
    }
  };

  const regenerateLink = async () => {
    const response = await sendRequest<{}, string>(
      `invite/${courseProps?.spec}/${params.get('group')}`,
      'POST'
    );
    if (!response.error) {
      return response.response;
    }
    return '';
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
          radius={'md'}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: 200,
            objectFit: 'cover',
          }}
        />
      )}
      <Center mt={'md'} mb={'md'}>
        <Title order={1} ta={'center'}>
          {course.title}
        </Title>
      </Center>
      <Paper ml={'xl'} mr={'xl'} mb={'md'} shadow={'md'} p={'md'}>
        {locale.link.inviteLinkSelectedGroup}:
        <Skeleton visible={linkLoading}>
          {course.invite ? (
            <LinkCopy
              inviteSpec={course.invite}
              regenerateLink={() => regenerateLink()}
            />
          ) : (
            <div>
              {params.get('group') === 'all'
                ? locale.link.inviteLinkChooseGroup
                : locale.link.inviteLinkGenerationError}
            </div>
          )}
        </Skeleton>
      </Paper>
      <Box ml={'xl'} mr={'xl'}>
        <TipTapEditor
          editorMode={false}
          content={course.description}
          onUpdate={() => {}}
        />
      </Box>
    </>
  );
};

export default memo(CourseMain);
