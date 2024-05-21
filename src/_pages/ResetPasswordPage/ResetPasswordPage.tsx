'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { changePasswordHandler, sendCodeToResetPasswordHandler } from '@/shared/api/reset-password';
import { RequireAnonymous } from '@/shared/components/RequireAnonymous/RequireAnonymous';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sendCode = () => {
    sendCodeToResetPasswordHandler(email)
      .then(() => setSent(true))
      .catch(() => setSent(false));
  };
  const changePassword = () => {
    changePasswordHandler(email, code, newPassword)
      .then(() => redirectToLogin())
      .catch((err) => console.log(err));
  };

  const redirectToLogin = () => {
    router.push('/login', { scroll: false });
  };

  return (
    <RequireAnonymous>
      <div className="h-screen grid content-center gap-3">
        <div className="flex gap-3 justify-center items-center">
          <div className="cursor-pointer" onClick={redirectToLogin}>
            Back
          </div>
          {sent ? <button onClick={() => setSent(false)}>Cancel</button> : null}
        </div>
        <div className="grid justify-center items-center">
          <div className={!sent ? 'grid gap-3' : 'hidden'}>
            <input
              type="text"
              placeholder="Email"
              className="bg-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-green-500" onClick={() => sendCode()}>
              Send code
            </button>
          </div>
          <div className={sent ? 'grid gap-3' : 'hidden'}>
            <input
              type="text"
              className="bg-gray-200"
              placeholder="Code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <input
              type="password"
              className="bg-gray-200"
              placeholder="NewPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <button className="bg-green-500" onClick={() => changePassword()}>
              Change
            </button>
          </div>
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    </RequireAnonymous>
  );
};
export default ResetPasswordPage;
