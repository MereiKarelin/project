'use client';
import { useState } from 'react';

import { GhostIcon } from '@/shared/assets/icons/GhostIcon';
import { PalleteRoundIcon } from '@/shared/assets/icons/PalleteRoundIcon';
import { Button } from '@/shared/ui/ButtonNew';
import { viewModes } from '@/widgets/Customizator/EditorNew/consts';
import { ViewMode } from '@/widgets/Customizator/EditorNew/types';
import { EditingArea } from '@/widgets/Customizator/EditorNew/uis/EditingArea';
import { ChangeBGToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';
import MainHeader from '@/widgets/MainHeader/MainHeader';

export const Editor = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  return (
    <div className="h-screen justify-items-center flex flex-col">
      <MainHeader onClickToCustomization={() => {}} header={{}} />

      <div className="flex flex-col gap-3 p-5 h-full">
        <div className="flex flex-row justify-between">
          <Button color="secondary" textColor="secondary" size="s">
            <PalleteRoundIcon />
            <span className="hidden sm:inline">Виджеты</span>
          </Button>
          <Button color="secondary" textColor="secondary" size="s" disabled>
            <GhostIcon width={24} />
            <span className="hidden sm:inline">Превью</span>
          </Button>
          <Button color="secondary" textColor="secondary" size="s">
            <ChangeBGToolIcon height={24} stroke="#fff" />
            <span className="hidden sm:flex h-6 flex-col justify-center">Изменить фон</span>
          </Button>
        </div>
        <div className="h-full relative flex flex-row justify-center items-center">
          <div className="absolute bottom-0 left-0 hidden lg:flex flex-col justify-between gap-3">
            <span className="font-bold">Вид просмотра:</span>
            <div className="flex flex-col 2xl:flex-row gap-3">
              {viewModes.map((mode) => (
                <Button
                  key={mode.id}
                  textColor="secondary"
                  color={viewMode !== mode.id ? 'disabled' : 'primary'}
                  size="s"
                  onClick={() => {
                    setViewMode(mode.id);
                  }}
                >
                  {mode.name}
                </Button>
              ))}
            </div>
          </div>
          <EditingArea viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
    </div>
  );
};
