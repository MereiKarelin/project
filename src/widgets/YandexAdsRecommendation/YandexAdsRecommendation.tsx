import { useEffect } from 'react';

import { isYandexAdsEnabled } from '@/shared/utils/yandex-ads';

interface IProps {
  yandexId: string;
  blockId: string;
}

const YandexAdsRecommendation = ({ yandexId, blockId }: IProps) => {
  useEffect(() => {
    if (!isYandexAdsEnabled()) return;

    // @ts-ignore
    window.yaContextCb = window.yaContextCb || [];
    // @ts-ignore
    window.yaContextCb.push(() => {
      // @ts-ignore
      Ya.Context.AdvManager.renderWidget({
        renderTo: yandexId,
        blockId: blockId,
      });
    });
  }, [blockId, yandexId]);

  if (!isYandexAdsEnabled()) return null;

  return <div id={yandexId} />;
};

export default YandexAdsRecommendation;
