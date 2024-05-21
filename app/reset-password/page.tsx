import ResetPasswordPage from '@/_pages/ResetPasswordPage/ResetPasswordPage';
import { RequireAnonymous } from '@/shared/components/RequireAnonymous/RequireAnonymous';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Сброс пароля',
  description: 'Сброс пароля для вашего аккаунта',
};

const ResetPassword = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <RequireAnonymous>
      <ResetPasswordPage />
    </RequireAnonymous>
  );
};
export default ResetPassword;
