import classNames from 'classnames';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './styles.module.scss';

export enum ButtonTheme {
  CLEAR = 'clear',
  OUTLINE = 'outline',
}

export type ButtonSizes = 'l' | 'm' | 's';
export type ButtonColor = 'primary' | 'disabled';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  theme?: ButtonTheme;
  disabled?: boolean;
  href?: string;
  buttonRadius?: string;
  buttonSize?: ButtonSizes;
  buttonColor?: ButtonColor;
}

const Button = (props: IProps) => {
  const {
    children,
    className,
    theme = ButtonTheme.OUTLINE,
    disabled = false,
    href,
    buttonSize = 'm',
    buttonRadius = 'rounded-md',
    buttonColor = 'primary',
    ...otherProps
  } = props;

  if (href) {
    return (
      <Link
        href={href}
        className={classNames(className, disabled && 'pointer-events-none cursor-default')}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classNames(
        styles.button,
        styles[theme],
        styles[buttonSize],
        className,
        styles[buttonColor],
        buttonRadius,
      )}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
