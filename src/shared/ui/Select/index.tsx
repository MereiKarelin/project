'use-client';
import classNames from 'classnames';
import { memo, useMemo, useState } from 'react';

import styles from './style.module.scss';

type OptionsArray = number[] | string[];

interface SelectProps {
  name?: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<HTMLButtonElement>) => void;
  value?: string;
  options: OptionsArray;
  necessary?: boolean;
  className?: string;
  hasError?: boolean;
}

export const Select = memo(
  ({
    placeholder,
    handleChange,
    className,
    value,
    options,
    name,
    necessary,
    hasError,
    ...otherProps
  }: SelectProps) => {
    const [isShown, setIsShown] = useState<boolean>(false);
    const onChange = (e: any) => {
      handleChange(e as React.ChangeEvent<HTMLButtonElement>);
    };

    const optionsList = useMemo(
      () =>
        options.map((opt) => (
          <button
            name={name}
            onClick={(e) => onChange(e)}
            className={styles.option}
            value={opt}
            key={opt}
          >
            {opt}
          </button>
        )),
      [options],
    );

    return (
      <div
        className={classNames(styles.container, className, {
          [styles.inputError]: hasError,
          [styles.inputOk]: !hasError,
        })}
        onClick={() => setIsShown((p) => !p)}
        onMouseLeave={() => setIsShown(false)}
        {...otherProps}
      >
        {!value ? placeholder : value}
        {isShown && <div className={styles.menu}>{optionsList}</div>}
      </div>
    );
  },
);
