import Profile from '@components/Profile/Profile';
import { IFullProfileBundle } from '@custom-types/data/IProfileInfo';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { getApiUrl } from '@utils/getServerUrl';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

function MyProfile(props: IFullProfileBundle) {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.profile.me} />
      <Profile {...props} />
    </>
  );
}

MyProfile.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default MyProfile;

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const access_token: string = req.cookies['access_token'] || '';
  const response = await fetch(`${API_URL}/api/bundle/profile`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    } as { [key: string]: string },
  });

  if (response.status === 200) {
    const profileData = await response.json();
    return {
      props: {
        user: profileData.user,
        attempt_info: profileData.attempt_info,
        task_info: profileData.task_info,
        rating_info: profileData.rating_info,
      } as IFullProfileBundle,
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/signin?referrer=%2Fprofile%2Fme',
    },
  };
};
