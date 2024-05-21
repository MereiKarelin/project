'use client';
import { Editor } from '@/_pages/Customizator/components';
import { RequireAuth } from '@/shared/components';

const Page = () => {
  return (
    <RequireAuth>
      <Editor editorType="profile" />
    </RequireAuth>
  );
};

export default Page;
