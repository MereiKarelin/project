import classNames from 'classnames';
import { Dispatch, memo, SetStateAction, useState } from 'react';

import styles from './CheckboxSwiper.module.scss';

type CheckboxPositions = 'left' | 'right';

interface CheckboxSwiperProps {
  setIsRememberLogin: Dispatch<SetStateAction<boolean>>;
  className?: string;
  backgroundActive?: string;
  background?: string;
  circleActive?: string;
  circle?: string;
  position?: CheckboxPositions;
  onChange?: () => void;
}

export const CheckboxSwiper = memo(
  ({
    setIsRememberLogin,
    className,
    backgroundActive = '#8EE4BA',
    background = '#E5E7EA',
    position = 'left',
    circle = 'white',
    circleActive = 'white',
    onChange,
  }: CheckboxSwiperProps) => {
    const [isActive, setIsActive] = useState(false);
    const onToggle = () => {
      const toggleValue = !isActive;
      setIsActive(toggleValue);
      onChange?.();
      setIsRememberLogin(toggleValue);
    };

    return (
      <div onClick={onToggle}>
        <div
          style={{
            background: isActive ? backgroundActive : background,
          }}
          className={classNames(styles.swiper, { [styles.swiperActive]: isActive }, className)}
        >
          <div
            style={{
              background: isActive ? circleActive : circle,
            }}
            className={classNames(styles.circle, {
              [styles.circleActive]: isActive,
            })}
          />
        </div>
      </div>
    );
  },
);
