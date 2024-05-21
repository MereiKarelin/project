import { Widget } from '@/_pages/Customizator/types';
import { Counter } from '@/entities/Counter/Counter';
import { IProfile } from '@/entities/Profile';
import { IObject } from '@daybrush/utils';

export const FriendsWidget: Widget = {
  id: 'WidgetFriends',
  name: 'Friends',
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
    const href = profile ? `/id/${profile.user.username}/relations?sort=friends` : '';

    return (
      <Counter
        caption="Друзья"
        palleteCaption="Связи"
        count={profile?.friends_count ?? 0}
        isPalleteVersion={isPalleteVersion}
        isScaled={isScaled}
        href={href}
        {...props}
      />
    );
  },
  bodyType: 'RoundRect',
};
