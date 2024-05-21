import { CSSProperties, useEffect, useState } from 'react';

import { parseJSXElements } from '@/_pages/Customizator/utils';
import { IProfile } from '@/entities/Profile';
import { viewportSizes } from '@/shared/consts';
import { convertDimensionToPercent } from '@/shared/utils/html';

type PropTypes = {
  templateHTML: string;
  userProfile: IProfile | null;
};

export const CustomProfileTemplate = ({ templateHTML, userProfile }: PropTypes) => {
  const [profileElement, setProfileElement] = useState<JSX.Element>();
  const [customPostScale, setCustomPostScale] = useState(1);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const scale = Math.min(screenWidth / 535, 1);

    setCustomPostScale(scale);
  }, [screenWidth]);

  useEffect(() => {
    if (!templateHTML || !userProfile) return;

    const screenSize = viewportSizes['profile'];
    const html = convertDimensionToPercent(templateHTML);
    const jsx = parseJSXElements(html, userProfile);

    const profile = (
      <div
        style={
          {
            height: `${screenSize.height * customPostScale}px`,
            width: `${screenSize.width * customPostScale}px`,
            '--viewport-width-scale': customPostScale,
            wordBreak: 'break-word',
          } as CSSProperties
        }
        className="relative h-full w-full flex flex-row justify-start items-center overflow-hidden"
      >
        {jsx?.markup}
      </div>
    );

    setProfileElement(profile);
  }, [templateHTML, userProfile, customPostScale]);

  return profileElement;
};
