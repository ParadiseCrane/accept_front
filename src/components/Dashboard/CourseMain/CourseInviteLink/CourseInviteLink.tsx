import { ICourse, ICourseDashboardMain } from '@custom-types/data/ICourse';
import { IGroupInvite } from '@custom-types/data/IGroup';
import { useLocale } from '@hooks/useLocale';
import { Paper, Skeleton } from '@mantine/core';
import { sendRequest } from '@requests/request';
import { LinkCopy } from '@ui/LinkCopy/LinkCopy';
import { useSearchParams } from 'next/navigation';
import { FC, memo, useCallback, useEffect, useState } from 'react';

const Component: FC<{
  courseSpec: string;
}> = ({ courseSpec }) => {
  const [linkLoading, setLinkLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const groupSpec = searchParams?.get('group');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const { locale } = useLocale();

  const message =
    groupSpec === 'all'
      ? locale.link.inviteLinkChooseGroup
      : locale.link.inviteLinkGenerationError;

  const skeletonVisible = linkLoading && groupSpec !== 'all';

  const fetchData = useCallback(async () => {
    if (groupSpec !== null && groupSpec !== undefined && groupSpec !== 'all') {
      setLinkLoading(true);
      const inviteRes = await sendRequest<{}, IGroupInvite[]>(
        `invite/${courseSpec}/${groupSpec}`,
        'GET'
      );
      if (!inviteRes.error) {
        setInviteLink(inviteRes.response[0].invite_spec);
      }
      setLinkLoading(false);
    }
  }, [courseSpec, groupSpec]);

  const regenerateLink = async () => {
    if (!searchParams) return '';
    const response = await sendRequest<{}, string>(
      `invite/${courseSpec}/${groupSpec}`,
      'POST'
    );
    if (!response.error) {
      return response.response;
    }
    return '';
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Paper ml={'xl'} mr={'xl'} mb={'md'} shadow={'md'} p={'md'}>
      {locale.link.inviteLinkSelectedGroup}:
      <Skeleton visible={skeletonVisible}>
        {inviteLink ? (
          <LinkCopy inviteSpec={inviteLink} regenerateLink={regenerateLink} />
        ) : (
          <>{message}</>
        )}
      </Skeleton>
    </Paper>
  );
};

export const CourseInviteLink = memo(Component);
