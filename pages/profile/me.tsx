import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';
import Profile from '@components/Profile/Profile';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';
import { IFullProfileBundle } from '@custom-types/data/IProfileInfo';

function MyProfile(props: IFullProfileBundle) {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.profile.me} />
      <Profile {...props} />;
    </>
  );
}

MyProfile.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default MyProfile;

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
  const response = await fetch(`${API_URL}/api/bundle/profile`, {
    headers: req.headers as { [key: string]: string },
  });

  if (response.status === 200) {
    const profileData = await response.json();
    return {
      props: {
        user: profileData.user,
        attempt_info: profileData.attempt_info,
        task_info: profileData.task_info,
        rating_info: profileData.rating_info,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/signin?referrer=%2Fprofile%2Fme',
    },
  };
};
