'use client';
import { Editor } from '@/_pages/Customizator/components';
import { RequireAuth } from '@/shared/components';

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <RequireAuth>
      <Editor editorType="profile" id={params.id} />
    </RequireAuth>
  );
};

export default Page;
