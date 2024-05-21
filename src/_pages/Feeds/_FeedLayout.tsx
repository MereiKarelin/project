'use client';
import MainHeader from '@/widgets/MainHeader/MainHeader';
import { IObject } from '@daybrush/utils';

interface IProps {
  leftBar?: JSX.Element;
  mainContent: JSX.Element;
  rightBar?: JSX.Element;
  header: IObject<string>;
}

export const _FeedLayout = ({ leftBar, mainContent, rightBar, header }: IProps) => {
  return (
    <>
      <div className="min-h-screen justify-items-center flex flex-col">
        <MainHeader header={header} />
        <div className="grid gap-3 min-[835px]:grid-cols-[1fr_514px_1fr] min-[514px]:justify-center mt-4 w-full">
          <div className="justify-self-end max-[835px]:hidden">{leftBar}</div>
          <div>{mainContent}</div>
          <div className="justify-self-start max-[835px]:hidden">{rightBar}</div>
        </div>
      </div>
    </>
  );
};
