import { Widget } from '@/_pages/Customizator/types';
import { Counter } from '@/entities/Counter/Counter';
import { IProfile } from '@/entities/Profile';
import { IObject } from '@daybrush/utils';

export const FollowersWidget: Widget = {
  id: 'WidgetFollowers',
  name: 'Followers',
  isRequired: false,
  isFunctional: true,
  isContentEditable: false,
  isWidgetCustomizable: false,
  isCustomBackground: true,
  maxCount: 1,
  style: {
    position: 'absolute',
    'border-radius': '24px',
    backgroundColor: '#808080',
  },
  Component: ({
    profile,
    isPalleteVersion = true,
    isScaled = true,
    props,
  }: {
    profile: IProfile | null;
    isPalleteVersion?: boolean;
    isScaled?: boolean;
    props?: IObject<any>;
  }) => {
    const href = profile ? `/id/${profile.user.username}/relations?sort=followers` : '';
    return (
      <Counter
        caption="Подписчики"
        palleteCaption="Связи"
        count={profile?.followers_count ?? 0}
        isPalleteVersion={isPalleteVersion}
        isScaled={isScaled}
        href={href}
        {...props}
      />
    );
  },
  bodyType: 'RoundRect',
};
