import { Widget } from '@/_pages/Customizator/types';
import { Fullname } from '@/entities';
import { IProfile } from '@/entities/Profile';
import { IObject } from '@daybrush/utils';

export const FullnameWidget: Widget = {
  id: 'WidgetFullname',
  name: 'Fullname',
  isRequired: true,
  isFunctional: true,
  isContentEditable: false,
  isCustomBackground: false,
  maxCount: 1,
  style: {
    position: 'absolute',
    top: '252px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    'border-radius': '0px',
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
      <Fullname
        profile={profile}
        data-scena-element-id="WidgetFullname"
        isScaled={isScaled}
        {...props}
      />
    );
  },
  bodyType: 'RoundRect',
};
