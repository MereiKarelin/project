import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useState } from 'react';

import { Avatar, Fullname } from '@/entities';
import { IProfile } from '@/entities/Profile';
import RelationInfo from '@/entities/Relations/ui/RelationInfo';
import { ITemplate } from '@/entities/Template';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { CustomProfileTemplate } from '@/features/CustomProfileTemplate/CustomProfileTemplate';
import { CreateDirectChat } from '@/features/DirectChats/CreateDirectChat/CreateDirectChat';
import { GetUserPosts } from '@/features/Post/GetUserPosts/GetUserPosts';
import { useLogin } from '@/shared/hooks';
import { extractTemplateHTML, getId } from '@/shared/utils';

interface ProfileProps {
  profileInfo: IProfile;
  activeTemplate: ITemplate | undefined;
}

export const Profile = ({ profileInfo, activeTemplate }: ProfileProps) => {
  const { setIsPopupLoginFormOpen } = useLogin();
  const { isLogged } = useAuth();
  const [activeTemplateHTML, setActiveTemplateHTML] = useState('');
  const router = useRouter();
  useEffect(() => {
    const getProfile = async () => {
      try {
        if (activeTemplate) {
          await extractTemplateHTML(activeTemplate.mobile_url)
            .then((res) => {
              setActiveTemplateHTML(res);
            })
            .catch((err) => console.error(err));
        } else {
          setActiveTemplateHTML('');
        }
      } catch (err) {
        console.error(err);
      }
    };
    void getProfile();
  }, [activeTemplate]);

  const handleLinkClick = (e: any, link: string) => {
    e.preventDefault();
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
    } else {
      router.push(link, { scroll: false });
    }
  };

  if (!profileInfo) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 items-center rounded-md">
      {activeTemplateHTML ? (
        <CustomProfileTemplate templateHTML={activeTemplateHTML} userProfile={profileInfo} />
      ) : (
        <div
          className="flex flex-col gap-3 pt-[80px] items-center"
          style={
            {
              wordBreak: 'break-word',
            } as CSSProperties
          }
        >
          <Avatar profile={profileInfo} />
          <Fullname profile={profileInfo} />
        </div>
      )}
      <RelationInfo user={profileInfo.user} />
      <CreateDirectChat targetUserReference={profileInfo.user.reference} />
      <GetUserPosts userId={getId(profileInfo.user)} />
    </div>
  );
};
