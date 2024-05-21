import { Metadata } from 'next';
import { headers } from 'next/headers';

import { RequireAnonymous } from '@/shared/components/RequireAnonymous/RequireAnonymous';
import LoginFormModal from '@/widgets/LoginFormModal/LoginFormModal';

export const metadata: Metadata = {
  title: 'Вход',
  description: 'С возвращением в Yourbandy! Войдите в свой аккаунт или зарегистрируйтесь!',
};

const Login = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <RequireAnonymous>
      <LoginFormModal header={header} />
    </RequireAnonymous>
  );
};

export default Login;
