import classNames from 'classnames';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ChosenWidget, ChosenWidgets } from '@/_pages/Customizator/components/Editor/types';
import { IProfile } from '@/entities/Profile';
import { PalleteRoundIcon, RightArrowIconLong } from '@/shared/assets/icons';
import { Button } from '@/shared/ui/ButtonNew';
import { getCurrentProfile } from '@/shared/utils';
import { MainHeader } from '@/widgets';

import { EditorType } from '../../types';

type PropTypes = {
  editorType: EditorType;
  selectedWidgets: ChosenWidgets;
  addWidgetToCanvas: (item: ChosenWidget) => void;
  isPalleteOpen: boolean;
  setIsPalleteOpen: Dispatch<SetStateAction<boolean>>;
};

export const WidgetPallete = ({
  editorType,
  selectedWidgets,
  addWidgetToCanvas,
  isPalleteOpen,
  setIsPalleteOpen,
}: PropTypes) => {
  const [palleteHeight, setPalleteHeight] = useState(0);
  const [isMobilePalleteOpen, setIsMobilePalleteOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<IProfile | null>(null);

  useEffect(() => {
    const profile = getCurrentProfile();
    setCurrentProfile(profile);
  }, []);

  const updatePalleteHeight = () => {
    const editingArea = document.getElementById('editingArea');
    if (editingArea) {
      setPalleteHeight(editingArea.offsetHeight);
    }
  };

  const handleShowPalleteClick = () => {
    const isOpen = !isPalleteOpen;

    const width = window.innerWidth;
    if (width <= 640) {
      setIsMobilePalleteOpen(isOpen);
    } else {
      setIsMobilePalleteOpen(false);
    }
    setIsPalleteOpen((prev) => !prev);
    updatePalleteHeight();
  };

  return (
    <>
      <div
        className={classNames(
          !isPalleteOpen && 'sm:w-[142.62px]',
          isPalleteOpen &&
            !isMobilePalleteOpen &&
            'w-[514px] z-20 bg-[#011627] rounded-3xl top-[-4px] left-0 py-1 pl-2 pr-1',
          editorType === 'profile' && 'relative sm:absolute',
          editorType === 'post' && 'relative',
          ' transition-all overflow-y-scroll flex flex-col gap-5 justify-start items-center',
        )}
        style={isPalleteOpen ? { height: `${palleteHeight}px` } : undefined}
      >
        <Button
          className={classNames(
            'relative flex flex-row gap-3 items-center justify-center rounded-3xl font-bold h-min w-full',
            '',
            'bg-[#00A3FF] hover:bg-[#4fbfff] text-[#fff] px-5 py-2 text-sm',
          )}
          size="s"
          onClick={handleShowPalleteClick}
        >
          <PalleteRoundIcon />
          <span className="hidden sm:inline">Виджеты</span>
        </Button>
        <div className={classNames('flex flex-col w-full gap-3', !isPalleteOpen && 'hidden')}>
          {Object.values(selectedWidgets).map((item) => (
            <div
              key={item.widget.id}
              className={classNames(
                'text-white',
                item.count === item.widget.maxCount && 'opacity-70',
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (item.count < item.widget.maxCount) {
                  addWidgetToCanvas(item);
                }
              }}
            >
              {
                <item.widget.Component
                  profile={currentProfile}
                  isScaled={false}
                  props={{ style: item.widget.style }}
                />
              }
            </div>
          ))}
        </div>
      </div>
      <div
        className={classNames(
          !isPalleteOpen && 'hidden',
          'fixed flex flex-col sm:hidden top-0 left-0 bg-[#011627]',
          ' w-full h-screen transition-all overflow-hidden gap-5 justify-start items-center bg-[#011627] ',
        )}
      >
        <MainHeader isVisible={isMobilePalleteOpen} isNoBackgroundColor isDarkTheme header={{}} />
        <Button
          className={classNames(
            'relative flex flex-row gap-3 items-center  font-bold h-min w-full',
            !isMobilePalleteOpen && 'rounded-3xl',
            isMobilePalleteOpen ? 'justify-between' : 'justify-center',
            'bg-[#00A3FF] hover:bg-[#4fbfff] text-[#fff] px-5 py-2 text-sm',
          )}
          size="s"
          onClick={handleShowPalleteClick}
        >
          {!isMobilePalleteOpen && <PalleteRoundIcon />}

          <span className="text-2xl font-bold">
            {isMobilePalleteOpen ? 'Вернуться в кастомизатор' : 'Виджеты'}
          </span>
          {isMobilePalleteOpen && <RightArrowIconLong />}
        </Button>
        {isMobilePalleteOpen && (
          <span className="text-2xl font-bold text-white">Доступные виджеты</span>
        )}
        <div
          className={classNames(
            'flex flex-col items-center w-full gap-3 overflow-y-scroll',
            !isPalleteOpen && 'hidden',
          )}
        >
          {Object.values(selectedWidgets).map((item) => (
            <div
              key={item.widget.id}
              className={classNames(
                'text-white w-full min-[514px]:w-[514px]',
                item.count === item.widget.maxCount && 'opacity-70',
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (item.count < item.widget.maxCount) {
                  addWidgetToCanvas(item);
                }
              }}
            >
              {
                <item.widget.Component
                  profile={currentProfile}
                  isScaled={false}
                  props={{ style: { ...item.widget.style, overflow: 'hidden' } }}
                />
              }
            </div>
          ))}
        </div>
      </div>
      {editorType === 'profile' && (
        <div className={'w-[142.62px] hidden sm:block invisible '}> </div>
      )}
    </>
  );
};
