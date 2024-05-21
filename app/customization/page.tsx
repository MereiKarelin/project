import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

import MainHeader from '@/widgets/MainHeader/MainHeader';

export const metadata: Metadata = {
  title: 'Кастомизация',
  description: 'Вдохните жизнь в свой мир, создавая уникальный контент и настраивая свой профиль!',
};

const ChooseCustomizationPage = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <>
      <MainHeader header={header} />
      <div className="justify-center grid gap-3">
        <div className="p-4 justify-center grid gap-3 min-[600px]:w-[514px]">
          <span className="text-xl font-bold text-center">Кастомизация</span>
          <p className="text-sm text-center">
            Вдохните жизнь в свой мир, создавая уникальный контент и настраивая свой профиль!
          </p>
        </div>
        <div className="min-[600px]:w-[514px] grid gap-3">
          <div className="flex gap-3">
            <Link
              href={'/customization/profile'}
              className="grid gap-3 justify-center bg-gray-300 w-full p-2 rounded-3xl hover:bg-green-300 transition-all ease-in"
            >
              <span className="text-xl font-bold text-center p-2">Профиль</span>
              <p className="text-center text-sm">Создайте собственный мир внутри Yourbandy!</p>
            </Link>
            <Link
              href={'/customization/post'}
              className="grid gap-3 justify-center bg-gray-300 w-full p-2 rounded-3xl hover:bg-blue-300 transition-all ease-in"
            >
              <span className="text-xl font-bold text-center p-2">Пост</span>
              <p className="text-center text-sm">
                Дополните интерактивностью контента для своего мира!
              </p>
            </Link>
          </div>
          <div className="bg-gray-300 p-2 rounded-3xl h-40 flex justify-center items-end hover:bg-fuchsia-300 transition-all ease-in cursor-pointer">
            <span className="text-md font-bold text-center ">С.к.О.р.О...</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChooseCustomizationPage;
