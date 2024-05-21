'use client';
import { MouseEvent, useEffect, useState } from 'react';

import { EditingArea } from '@/_pages/Customizator/components/Editor/EditingArea';
import { DATA_SCENA_ELEMENT_ID } from '@/_pages/Customizator/consts';
import { EditorType, ViewMode } from '@/_pages/Customizator/types';
import { MainHeader } from '@/widgets';

type PropTypes = {
  editorType: EditorType;
  id?: string;
};

export const Editor = ({ editorType, id }: PropTypes) => {
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [isDeselectAllTargets, setIsDeselectAllTargets] = useState(false);
  const [isPalleteOpen, setIsPalleteOpen] = useState(false);
  const [isMobilePalleteOpen, setIsMobilePalleteOpen] = useState(true);

  useEffect(() => {
    const width = window.innerWidth;
    if (width <= 640) {
      setIsMobilePalleteOpen(isPalleteOpen);
    } else {
      setIsMobilePalleteOpen(false);
    }
  }, [isPalleteOpen]);

  return (
    <div
      className="h-screen justify-items-center flex flex-col"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        const viewportRect = document
          .getElementsByClassName('scena-viewport-container')?.[0]
          .getBoundingClientRect();

        if (viewportRect) {
          //when clicked outside the viewport deselect all targets
          if (
            e.clientX < viewportRect.left ||
            e.clientX > viewportRect.right ||
            e.clientY < viewportRect.top ||
            e.clientY > viewportRect.bottom
          ) {
            const target = e.target as HTMLDivElement;
            if (!target.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
              //click on moveable must not deselect all targets
              setIsDeselectAllTargets(true);
            }
          }
        }
      }}
    >
      <MainHeader isVisible={!isMobilePalleteOpen} header={{}} />

      <div className="flex flex-col gap-3 p-5 h-full">
        <EditingArea
          id={id}
          editorType={editorType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isDeselectAllTargets={isDeselectAllTargets}
          setIsDeselectAllTargets={setIsDeselectAllTargets}
          isPalleteOpen={isPalleteOpen}
          setIsPalleteOpen={setIsPalleteOpen}
          isMobilePalleteOpen={isMobilePalleteOpen}
        />
      </div>
    </div>
  );
};
