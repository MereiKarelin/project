import Logo from '@/shared/assets/icons/Logo';
import { Button } from '@/shared/ui/ButtonNew';

import { HomeIconsBottom } from './HomeIconsBottom';
import { HomeIconsTop } from './HomeIconsTop';

const MobileHome = () => {
  return (
    <div className="flex flex-col justify-between items-start h-screen w-full sm:px-4">
      <div className="flex flex-row justify-between w-full px-2">
        <div className="h-full py-2">
          <Logo
            className="cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out"
            fill="black"
          />
        </div>
        <div className="h-full py-2">
          <Button
            href="/login"
            className="relative flex flex-row gap-3 items-center justify-center rounded-3xl font-bold h-min bg-[#2DC96B] text-base tracking-wide py-3 px-5 xs:px-7 text-white shadow-[0_3px_10px_#818181]"
          >
            Войти в аккаунт
          </Button>
        </div>
      </div>
      <div className="relative h-full flex flex-col items-center justify-start gap-8 w-full lg:w-[640px] tracking-tight overflow-x-hidden">
        <HomeIconsTop top={50} />

        <span
          className="text-4xl sm:text-[48px] font-[900] w-[400px] sm:w-[500px] leading-[1] text-center px-2 sm:px-0"
          style={{
            background: 'linear-gradient(180deg, #0094FF 0%, #00FF85 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Индивидуальность в каждом действии
        </span>
        <div className="flex flex-col items-center justify-center gap-4 px-2 sm:px-0">
          <span className="text-center text-2xl font-semibold">
            Социальная сеть для кастомизации и персонализации. Создания собственных страниц
          </span>
          <span className="text-center text-2xl font-semibold">
            Общайтесь и делитесь с друзьями индивидуальностью профиля, постов. Создавайте свои
            уникальные страницы, интернет магазины, ведите блог в уникальном формате.
          </span>
        </div>
        <Button
          href="/login"
          className="relative flex flex-row gap-3 items-center justify-center rounded-3xl font-bold h-min bg-[#2DC96B] text-base tracking-wide py-3 px-7 text-white shadow-[0_3px_10px_#818181]"
        >
          Стоит только начать
        </Button>
        <HomeIconsBottom top={-80} />
      </div>
    </div>
  );
};

export default MobileHome;
