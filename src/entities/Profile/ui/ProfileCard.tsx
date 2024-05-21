import Link from 'next/link';
import { useEffect, useState } from 'react';

import { IProfile } from '@/entities/Profile';
import { CustomProfileTemplate } from '@/features/CustomProfileTemplate/CustomProfileTemplate';
import { defaultBGImage } from '@/shared/consts';
import { extractTemplateHTML } from '@/shared/utils';

interface IProps {
  profile: IProfile;
}

export const ProfileCard = ({ profile }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTemplateHTML, setActiveTemplateHTML] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (profile.template) {
          await extractTemplateHTML(profile.template.mobile_url)
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
  }, [profile.template]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Link
        href={`/id/${profile.user.username}`}
        className="grid gap-3 mb-2 rounded-2xl bg-white cursor-pointer shadow-lg transition-all duration-500"
      >
        <div
          className="rounded-2xl flex justify-center bg-center bg-cover items-center"
          style={{ backgroundImage: `url(${profile?.template?.background_url ?? defaultBGImage})` }}
        >
          <CustomProfileTemplate templateHTML={activeTemplateHTML} userProfile={profile} />
        </div>
      </Link>
    </>
  );
};
