import Link from 'next/link';
import Logo from '../../shared/assets/icons/Logo';

const LawHeader = () => {
  return (
    <div className="top-0 grid gap-3 justify-center w-full">
      <div className="grid justify-center items-center">
        <Logo fill={'black'} />
      </div>
      <div className="flex gap-3 max-[600px]:flex-col">
        <Link href={'/policy'} className="bg-green-500 text-white rounded-full p-2 pr-4 pl-4">
          Политика конфиденциальности
        </Link>
        <Link href={'/terms'} className="bg-green-500 text-white rounded-full p-2 pr-4 pl-4">
          Пользовательское соглашение
        </Link>
      </div>
    </div>
  );
};
export default LawHeader;
