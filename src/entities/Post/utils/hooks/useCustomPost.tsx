import { SetStateAction, useCallback, useEffect, useState } from 'react';

import { parseJSXElements } from '@/_pages/Customizator/utils';
import { IPost } from '@/entities/Post/model/types';
import { screenTypes } from '@/shared/consts';
import { JSXObject, screenType } from '@/shared/types';
import { extractTemplateHTML, getScreenType } from '@/shared/utils';
import { convertDimensionToPercent } from '@/shared/utils/html';

export const useCustomPost = (
  post: IPost,
  baseWidth: number,
  htmlWindowId: string,
  maxScale = 1,
  setIsLoading?: (value: SetStateAction<boolean>) => void,
) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenType, setScreenType] = useState<screenType>(screenTypes.desktop);
  const [jsx, setJSX] = useState<JSXObject>();
  const [customPostScale, setCustomPostScale] = useState(1);

  const updateScreenType = useCallback(
    (width: number) => {
      const newScreenType = getScreenType(width);
      if (newScreenType !== screenType) {
        setScreenType(() => newScreenType);
      }
    },
    [screenType],
  );

  useEffect(() => {
    if (htmlWindowId) {
      const handleResize = () => {
        const postWindow = document.getElementById(htmlWindowId);
        const width = postWindow?.offsetWidth ?? 10000;
        setScreenWidth(width);
        updateScreenType(width);
      };
      const postWindow = document.getElementById(htmlWindowId);

      if (postWindow) {
        const width = postWindow.offsetWidth;
        setScreenWidth(width);
        updateScreenType(width);
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    } else {
      const handleResize = () => {
        const width = window.innerWidth;
        setScreenWidth(width);
        updateScreenType(width);
      };

      setScreenWidth(window.innerWidth);
      updateScreenType(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [htmlWindowId, updateScreenType]);

  useEffect(() => {
    if (!jsx) return;

    const scale = Math.min(screenWidth / baseWidth, maxScale);

    setCustomPostScale(scale);
  }, [screenType, screenWidth, baseWidth, setIsLoading, jsx, maxScale]);

  useEffect(() => {
    if (post?.type !== 'CUSTOMIZED') {
      if (post) setIsLoading?.(false);
      return;
    }

    const template = post.body;
    let url = '';
    if (screenType === screenTypes.desktop) {
      url = template.desktop_url;
    } else if (screenType === screenTypes.tablet) {
      url = template.tablet_url;
    } else if (screenType === screenTypes.mobile) {
      url = template.mobile_url;
    } else {
      return;
    }

    extractTemplateHTML(url)
      .then((res) => {
        // const updatedHtml = updateTransformOrigin(res);

        const templateHTML = res;
        const html = convertDimensionToPercent(templateHTML);
        const parsed = parseJSXElements(html);
        setJSX(parsed);
      })
      .catch((err) => console.error(err));

    setIsLoading?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, screenType]);

  return { jsx, customPostScale };
};
