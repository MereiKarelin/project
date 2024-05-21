import classNames from 'classnames';
import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef, Ref } from 'react';

type PropTypes = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'l' | 'm' | 's' | 'xs';
  color?: 'primary' | 'secondary' | 'disabled';
  textColor?: 'primary' | 'secondary' | 'disabled' | 'danger';
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

//TODO: replace shared/ui/Button with this Button

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, PropTypes>(
  function buttonElement(
    {
      children,
      className = undefined,
      disabled = false,
      size = 'm',
      color = 'primary',
      textColor = 'primary',
      href = '',
      ...props
    },
    ref?,
  ) {
    const defaultClassName =
      'relative flex flex-row gap-3 items-center justify-center rounded-3xl font-bold h-min overflow-hidden';

    if (href) {
      return (
        <Link
          href={href}
          className={classNames(className, disabled && 'pointer-events-none cursor-default')}
          ref={ref as Ref<HTMLAnchorElement>}
          {...props}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        className={classNames(
          !className && color == 'primary' && !disabled && 'bg-[#78E378]',
          !className && color == 'secondary' && !disabled && 'bg-[#00A3FF]',
          !className && color === 'primary' && !disabled && 'hover:bg-[#63f114]',
          !className && color === 'secondary' && !disabled && 'hover:bg-[#4fbfff]',
          !className && textColor == 'primary' && !disabled && 'text-[#011627]',
          !className && textColor == 'secondary' && !disabled && 'text-[#fff]',
          !className && textColor == 'danger' && !disabled && 'text-[#FF3A3A]',
          !className && (color == 'disabled' || disabled) && 'bg-[#707991]',
          !className && size === 'xs' && 'px-2 py-2 text-xs',
          !className && size === 's' && 'px-5 py-2 text-sm',
          !className && size === 'm' && 'py-4 px-6 text-sm',
          !className && size === 'l' && 'p-5 text-xl',
          disabled && 'pointer-events-none opacity-50',
          className || defaultClassName,
        )}
        disabled={disabled}
        ref={ref as Ref<HTMLButtonElement>}
        {...props}
      >
        {children}
      </button>
    );
  },
);
