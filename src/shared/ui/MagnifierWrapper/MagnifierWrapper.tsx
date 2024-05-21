import classNames from 'classnames';
import { ReactNode, useEffect, useRef, useState } from 'react';

type PropTypes = {
  isOpen: boolean;
  imageRect: DOMRect | undefined;
  parentRect: DOMRect | undefined;
  children: ReactNode;
  magnification?: number;
};

const gapV = 1; //vertical gap in px between magnified image and small reaction image
const padding = 5; //padding in px around magnified image

const getMagnifiedUpperRect = (
  imageRect: DOMRect | undefined,
  parentRect: DOMRect | undefined,
  magnification: number,
) => {
  if (!imageRect || !parentRect) return null;
  const maxHeight = imageRect.top - parentRect.top - gapV;
  const maxWidth = parentRect.width;

  let height = Math.min(imageRect.height * magnification, maxHeight);
  let width = Math.min(imageRect.width * magnification, maxWidth);

  const realMagnification = Math.min(
    height / imageRect.height,
    width / imageRect.width,
    magnification,
  );

  const ratio = imageRect.width / imageRect.height;
  height = Math.max(imageRect.height * realMagnification - 2 * padding, 0);
  width = height * ratio;

  const top = Math.max(imageRect.top - height - gapV, parentRect.top) - padding;
  const left = Math.max(imageRect.left - width / 2 + imageRect.width / 2, parentRect.left);

  return { top, left, height, width };
};

export const MagnifierWrapper = ({
  isOpen,
  imageRect,
  parentRect,
  children,
  magnification = 100,
}: PropTypes) => {
  const upperRect = getMagnifiedUpperRect(imageRect, parentRect, magnification);
  const [isVisible, setIsVisible] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      clearTimeout(timeout.current);
      return;
    }
    timeout.current = setTimeout(() => setIsVisible(false), 700);
  }, [isOpen]);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${upperRect?.top ?? 0}px`,
        left: `${upperRect?.left ?? 0}px`,
        height: `${upperRect?.height ?? 0}px`,
        width: 'auto',
      }}
      className={classNames(
        'p-[5px] bg-black/20 rounded-lg transition-all ease-in-out duration-700 z-30',
        isOpen && !isVisible && 'block opacity-0',
        isOpen && isVisible && 'opacity-100',
        !isOpen && isVisible && 'opacity-0',
        !isOpen && !isVisible && 'hidden',
      )}
    >
      {children}
    </div>
  );
};
