import { useEffect, useMemo, useState } from 'react';

import { convertCssStringToStyleObject } from '@/_pages/Customizator/utils';
import { getBtnElement } from '@/entities/Link/utils';
import { getEditorTarget } from '@/shared/utils';
import { IObject } from '@daybrush/utils';

export const useStyle = (isEditable: boolean, targetId: string) => {
  const [id, setId] = useState<string | undefined>(undefined);
  const [sizeId, setSizeId] = useState<string | undefined>(undefined);
  const [width, setWidth] = useState(273);
  const [btnStyle, setBtnStyle] = useState<IObject<string>>();

  const target = useMemo(() => getEditorTarget(id), [id]);
  const cssText = target?.style.cssText;
  const style = useMemo(() => convertCssStringToStyleObject(cssText ?? ''), [cssText]);
  const btn = getBtnElement(target);

  if (id && isEditable) {
    const btnCssText = btn?.style.cssText;
    const btStyle = convertCssStringToStyleObject(btnCssText ?? '');

    const _sizeId = `${id ?? ''}width${style.width ?? ''}height${
      style.height
    }bg${btStyle?.backgroundImage}`;

    if (_sizeId !== sizeId) {
      setSizeId(_sizeId);
    }
  }

  useEffect(() => {
    setId(targetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!style.width && !target && !isEditable) return;
    const w = parseFloat(style.width);

    const btnCssText = btn?.style.cssText;
    const btStyle = convertCssStringToStyleObject(btnCssText ?? '');
    setBtnStyle(btStyle);

    setWidth(w);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeId]);

  return { style, btnStyle, sizeId, width, target };
};
