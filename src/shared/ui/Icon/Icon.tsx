import classNames from 'classnames';
import React, { memo, SVGProps } from 'react';
import styles from './Icon.module.scss';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  Svg: React.VFC<React.SVGProps<SVGSVGElement>>;
  inverted?: boolean;
}

export const Icon = memo((props: IconProps) => {
  const { className, Svg, inverted, ...otherProps } = props;

  return (
    <Svg
      className={classNames(styles.Icon, { [styles.Inverted]: inverted }, [className])}
      {...otherProps}
    />
  );
});
