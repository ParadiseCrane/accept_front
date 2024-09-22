import LoginForm from '@components/Auth/LoginForm';
import { LoginLayout } from '@layouts/LoginLayout';
import { sendRequest } from '@requests/request';
import { ReactElement, useCallback } from 'react';

function AddAccount() {
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
      }).then((res) => res.response),
    []
  );
  return <LoginForm signIn={signIn} />;
}

AddAccount.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'login'}>{page}</LoginLayout>;
};
export default AddAccount;
