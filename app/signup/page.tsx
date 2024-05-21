import { Metadata } from 'next';
import { headers } from 'next/headers';

import { SignupUser } from '@/processes/SignupUser/SignupUser';
import { RequireAnonymous } from '@/shared/components/RequireAnonymous/RequireAnonymous';

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Присоединяйтесь к увлекательной кастомизации и общению!',
};

const SignUp = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <RequireAnonymous>
      <SignupUser header={header} />
    </RequireAnonymous>
  );
};

export default SignUp;
