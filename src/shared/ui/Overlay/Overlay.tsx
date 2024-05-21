import { CSSProperties, MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type PropTypes = {
  isVisible: boolean;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};
export const Overlay = ({ isVisible, children, style, onClick }: PropTypes) => {
  const root = useRef<HTMLElement>();

  useEffect(() => {
    root.current = document.getElementsByTagName('body')?.[0];
  }, []);

  if (!isVisible || !root.current) return null;

  const overlay = (
    <div
      className="absolute top-0 left-0 h-screen w-screen z-50"
      onClick={(e) => onClick?.(e)}
      style={style}
    >
      {children}
    </div>
  );

  return createPortal(overlay, root.current);
};
