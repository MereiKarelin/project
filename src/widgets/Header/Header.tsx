import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';

import Logo from '@/shared/assets/icons/logo/logo.svg';
import Button from '@/shared/ui/Button';

import styles from './Header.module.scss';

interface HeaderProps {
  className?: string;
}

export const Header = memo(({ className }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onOpen = () => setOpen(true);
  const onClose = (e: any) => {
    e.stopPropagation();
    setOpen(false);
  };

  const redirectTo = (link: string) => {
    router.push(`/${link}`, { scroll: false });
  };

  //TODO: add new design of header Фигма/Другое
  const desktop = (
    <div className={classNames('flex justify-between items-center', className, styles.container)}>
      <Image
        src={Logo}
        alt="logo"
        onClick={() => redirectTo('')}
        className="cursor-pointer hover:opacity-5 transition-opacity ease-in-out"
      />
      <div className="flex gap-10">
        {/*<Link href="/support">*/}
        {/*  <Button className={styles.navBtn}>Support</Button>*/}
        {/*</Link>*/}
        {/*<Link href="/about">*/}
        {/*  <Button className={styles.navBtn}>About us</Button>*/}
        {/*</Link>*/}
        {/*<Link href="/update">*/}
        {/*  <Button className={styles.navBtn}>Update</Button>*/}
        {/*</Link>*/}
        {/*<Link href="/discover">*/}
        {/*  <Button className={styles.navBtn}>Discover</Button>*/}
        {/*</Link>*/}
        <Link href="/login">
          <Button className={styles.buttonSignup}>Sign Up</Button>
        </Link>
      </div>
    </div>
  );

  const mobile = (
    <div className={styles.containerMobile}>
      <div className="flex gap-10 items-center relative justify-around">
        <Link href="/">
          <Image
            src={Logo}
            alt="logo"
            className="cursor-pointer active:opacity-5 transition-opacity ease-in-out"
          />
        </Link>
        <div className={classNames(styles.burger, { [styles.open]: open })} onClick={onOpen}>
          <div className={styles.menuButton} />
          <div className={styles.menuButton} />
          <div className={styles.menuButton} />
        </div>
        <div className={classNames(styles.navbar, { [styles.open]: open })} onClick={onClose}>
          <div className="flex flex-col gap-10 w-full">
            {/*<Link href="/support">*/}
            {/*  <Button className={styles.navBtn}>Support</Button>*/}
            {/*</Link>*/}
            {/*<Link href="/about">*/}
            {/*  <Button className={styles.navBtn}>About us</Button>*/}
            {/*</Link>*/}
            {/*<Link href="/update">*/}
            {/*  <Button className={styles.navBtn}>Update</Button>*/}
            {/*</Link>*/}
            {/*<Link href="/discover">*/}
            {/*  <Button className={styles.navBtn}>Discover</Button>*/}
            {/*</Link>*/}
            <Link href="/login">
              <Button className={styles.buttonSignup}>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {desktop}
      {mobile}
    </>
  );
});
