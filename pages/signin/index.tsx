import LoginForm from '@components/Auth/LoginForm';
import { useUser } from '@hooks/useUser';
import { LoginLayout } from '@layouts/LoginLayout';
import { ReactElement } from 'react';

function SignIn() {
  const { signIn } = useUser();

  return <LoginForm signIn={signIn} />;
}

SignIn.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'login'}>{page}</LoginLayout>;
};
export default SignIn;
