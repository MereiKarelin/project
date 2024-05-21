'use client';

import classNames from 'classnames';
import { HTMLAttributes, memo } from 'react';
import styles from './Modal.module.scss';

type ModalSize = 'full';
interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  size?: ModalSize;
}

const Modal = memo(({ isOpen, children, className, size, ...otherProps }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={classNames(styles.container)}>
      <div className={styles.wrapper}>
        <div
          className={classNames(styles.content, { [styles.full]: size }, className)}
          {...otherProps}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

export default Modal;
