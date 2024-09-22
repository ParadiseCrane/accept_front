import LoginForm from '@components/Auth/LoginForm';
import { useUser } from '@hooks/useUser';
import { LoginLayout } from '@layouts/LoginLayout';
import { sendRequest } from '@requests/request';
import { clearCookie } from '@utils/cookies';
import { ReactElement, useCallback } from 'react';

function AddAccount() {
  const { refreshAccess } = useUser();
  const signIn = useCallback(
    (org: string, login: string, password: string) =>
      sendRequest<
        {
          organization: string;
          login: string;
          password: string;
        },
        boolean
      >('/auth/add_account', 'POST', {
        organization: org,
        login,
        password,
      }).then(async (res) => {
        clearCookie('accounts');
        refreshAccess();
        return res.response;
      }),
    []
  );
  return <LoginForm signIn={signIn} />;
}

AddAccount.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'login'}>{page}</LoginLayout>;
};
export default AddAccount;
