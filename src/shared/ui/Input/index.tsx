'use-client';
import classNames from 'classnames';
import { InputHTMLAttributes, memo, useEffect, useRef, useState } from 'react';

import CheckMark from '@/shared/assets/icons/CheckMark';
import CloseIcon from '@/shared/assets/icons/CloseIcon';
import EyesClosedIcon from '@/shared/assets/icons/EyesClosedIcon';
import EyesOpenedIcon from '@/shared/assets/icons/EyesOpenedIcon';

import styles from './style.module.scss';

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'readOnly'
>;

interface InputProps extends HTMLInputProps {
  componentClassName?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autofocus?: boolean;
  readonly?: boolean;
  necessary?: boolean;
  passwordHidden?: boolean;
  loading?: boolean;
  hasError?: boolean;
  id?: string;
  variant?: 'default' | 'contained-light' | 'no-error-icon';
  isDynamicPlaceholder?: boolean;
}

export const Input = memo((props: InputProps) => {
  const {
    componentClassName,
    inputClassName,
    value,
    onChange,
    autofocus,
    readonly,
    type = 'text',
    placeholder,
    necessary,
    passwordHidden,
    loading,
    hasError,
    children,
    variant = 'default',
    isDynamicPlaceholder,
    ...otherProps
  } = props;
  const [inputType, setInputType] = useState(type);
  const ref = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isVisiblePlaceholder, setIsVisiblePlaceholder] = useState(true);
  const hasNoErrorIcon = variant !== 'no-error-icon' && variant !== 'contained-light';
  const hasNoIcons = type !== 'password' && !hasNoErrorIcon;

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  useEffect(() => {
    if (autofocus) {
      ref?.current?.focus();
    }
  }, [autofocus]);

  return (
    <div
      className={classNames(
        styles.container,
        { [styles.focus]: isFocus, [styles.inputError]: hasError, [styles.inputOk]: !hasError },
        componentClassName,
      )}
    >
      <input
        id={props.id}
        ref={ref}
        className={classNames(
          inputClassName,
          { [styles.readonly]: readonly },
          styles.Input,
          value && hasNoIcons && 'mr-[37px]',
          type === 'password' && hasNoErrorIcon && 'mr-[5px]',
        )}
        value={value}
        type={inputType}
        onChange={onChangeHandler}
        onFocus={() => {
          setIsFocus(true);
          setIsVisiblePlaceholder(true);
        }}
        onBlur={() => setIsFocus(false)}
        readOnly={readonly}
        placeholder={isVisiblePlaceholder ? placeholder : ''}
        {...otherProps}
      />
      {loading && value && (
        <div className="mr-4 ml-3">
          <div className={styles.loader} />
        </div>
      )}
      {hasNoErrorIcon && hasError ? (
        <div className="mr-4 ml-3">
          <CloseIcon fill="#f34141" />
        </div>
      ) : (
        hasNoErrorIcon &&
        value && (
          <div className="mr-4 ml-3">
            <CheckMark fill="#8ee4ba" width={20} />
          </div>
        )
      )}
      <div className="cursor-pointer">
        {inputType === 'password' && value && (
          <div onClick={() => setInputType('text')}>
            <EyesClosedIcon className="mr-5" />
          </div>
        )}
        {passwordHidden && inputType === 'text' && (
          <div onClick={() => setInputType('password')}>
            <EyesOpenedIcon className="mr-5" />
          </div>
        )}
      </div>
      {isDynamicPlaceholder && isVisiblePlaceholder && !value && (
        <div
          className={classNames(
            variant === 'contained-light' ? styles.LabelContainedLight : styles.Label,
            { [styles.active]: isFocus },
            'flex items-center gap-2',
          )}
        >
          {children}
          <label htmlFor={props.id}>
            {placeholder} {necessary && <span className={styles.necessary}>*</span>}
          </label>
        </div>
      )}
    </div>
  );
});
