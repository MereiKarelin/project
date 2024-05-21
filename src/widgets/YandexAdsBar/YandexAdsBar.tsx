import { useEffect } from 'react';

import { isYandexAdsEnabled } from '@/shared/utils/yandex-ads';

interface IProps {
  yandexId: string;
  blockId: string;
}

const YandexAdsBar = ({ yandexId, blockId }: IProps) => {
  useEffect(() => {
    if (!isYandexAdsEnabled()) return;
    if (!blockId || !yandexId) return;
    // @ts-ignore
    window.yaContextCb = window.yaContextCb || [];
    // @ts-ignore
    window.yaContextCb.push(() => {
      // @ts-ignore
      Ya.Context.AdvManager.render({
        blockId: blockId,
        renderTo: yandexId,
      });
    });
  }, [blockId, yandexId]);

  if (!isYandexAdsEnabled()) return null;

  return <div id={yandexId} />;
};

export default YandexAdsBar;
