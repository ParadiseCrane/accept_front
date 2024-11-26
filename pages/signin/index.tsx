import { ReactElement } from 'react';
import { LoginLayout } from '@layouts/LoginLayout';
import { useUser } from '@hooks/useUser';
import LoginForm from '@components/Auth/LoginForm';

function SignIn() {
  const { signIn } = useUser();

  return <LoginForm signIn={signIn} />;
}

SignIn.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'login'}>{page}</LoginLayout>;
};
export default SignIn;
