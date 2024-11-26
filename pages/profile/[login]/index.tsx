import { DefaultLayout } from '@layouts/DefaultLayout';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';
import ProfileInfo from '@components/Profile/ProfileInfo/ProfileInfo';
import styles from '@styles/profile/login.module.css';
import { useUser } from '@hooks/useUser';
import Title from '@ui/Title/Title';
import ProfileSticky from '@components/Profile/ProfileSticky/ProfileSticky';
import { IFullProfileBundle } from '@custom-types/data/IProfileInfo';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

function UserProfile(props: IFullProfileBundle) {
  const { isAdmin, accessLevel } = useUser();
  return (
    <div className={styles.wrapper}>
      <Title title={props.user.shortName} />
      {isAdmin && accessLevel >= props.user.role.accessLevel && (
        <>
          <ProfileSticky {...props} />
        </>
      )}
      <ProfileInfo {...props} />
    </div>
  );
}

UserProfile.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default UserProfile;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.login)
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };

  const response = await fetchWrapperStatic({
    url: `bundle/profile/${query.login}`,
    req,
  });

  if (response.status === 307) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile/me',
      },
    };
  }

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
      destination: '/404',
    },
  };
};
