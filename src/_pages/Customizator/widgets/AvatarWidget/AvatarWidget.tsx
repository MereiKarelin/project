import { Widget } from '@/_pages/Customizator/types';
import { Avatar } from '@/entities';
import { IProfile } from '@/entities/Profile';
import { IObject } from '@daybrush/utils';

export const AvatarWidget: Widget = {
  id: 'WidgetAvatar',
  name: 'Avatar',
  isRequired: true,
  isFunctional: true,
  isContentEditable: false,
  isCustomBackground: false,
  maxCount: 1,
  style: {
    position: 'absolute',
    top: '80px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: '160px',
    height: '160px',
  },
  Component: ({
    profile,
    isScaled = true,
    props,
  }: {
    profile: IProfile | null;
    isScaled?: boolean;
    props?: IObject<any>;
  }) => {
    return (
      <Avatar
        profile={profile}
        isScaled={isScaled}
        data-scena-element-id="WidgetAvatar"
        {...props}
      />
    );
  },
  bodyType: 'Ellipse',
};
