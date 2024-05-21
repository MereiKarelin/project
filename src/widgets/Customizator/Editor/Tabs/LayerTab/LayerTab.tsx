import MoveableHelper from 'moveable-helper';
import { RefObject, useCallback } from 'react';
import Selecto from 'react-selecto';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import File from '@/widgets/Customizator/Editor/components/Folder/File';
import Folder, { FileInfo } from '@/widgets/Customizator/Editor/components/Folder/Folder';
import { LayerIcon } from '@/widgets/Customizator/Editor/Icons/LayerIcon';
import LabelBox from '@/widgets/Customizator/Editor/Inputs/LabelBox';
import { ElementInfo } from '@/widgets/Customizator/Editor/types';
import { getIds, isScenaFunction, moves } from '@/widgets/Customizator/Editor/utils';
import { isString } from '@daybrush/utils';

import type {
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
} from '@/widgets/Customizator/Editor/types';
const renderFile = ({ name }: File['props']) => {
  return <LabelBox type={'full'} label={name}></LabelBox>;
};

const onSelect = (eventBus: EventBus, selected: string[]) => {
  eventBus.requestTrigger('selectLayers', {
    selected,
  });
};

const checkMove = (prevInfo: FileInfo<ElementInfo>) => {
  const jsx = prevInfo.value.jsx;

  if (isScenaFunction(jsx)) {
    return false;
  }

  return isString(jsx) || isString(jsx.type);
};

type PropTypes = {
  viewportRef: RefObject<Viewport>;
  moveableHelper: MoveableHelper;
  targetsManager: TargetsManager;
  historyManager: HistoryManager;
  selecto: RefObject<Selecto>;
  eventBus: EventBus;
};

export const LayerTab: Tool = {
  id: 'Layers',
  type: 'tab',
  icon: () => <LayerIcon />,
  title: 'Layers',

  Component: ({
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
  }: PropTypes) => {
    const viewport = viewportRef.current;

    const infos = viewport?.getViewportInfos() ?? [];
    const selected = getIds(targetsManager.selectedTargets);

    const onMove = useCallback(
      async (
        selectedInfos: Array<FileInfo<ElementInfo>>,
        parentInfo?: FileInfo<ElementInfo>,
        prevInfo?: FileInfo<ElementInfo>,
      ) => {
        const viewport = viewportRef.current;

        if (!viewport) return;

        await moves(
          selectedInfos.map((info, i) => ({
            info: info.value,
            parentInfo: viewport.getInfo(parentInfo ? parentInfo.fullId : 'viewport'),
            prevInfo:
              i === 0
                ? viewport.getInfo(prevInfo ? prevInfo.fullId : '')
                : selectedInfos[i - 1].value,
          })),
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        );
      },
      [viewportRef, moveableHelper, targetsManager, historyManager, selecto, eventBus],
    );

    return (
      <Folder<ElementInfo>
        scope={[]}
        name=""
        properties={infos}
        multiselect={true}
        isMove={true}
        getId={(v: ElementInfo) => v.id}
        getFullId={(id) => id}
        getName={(v: ElementInfo) => v.name}
        getChildren={(v: ElementInfo) => v.children || []}
        selected={selected}
        onSelect={(selected: string[]) => onSelect(eventBus, selected)}
        checkMove={checkMove}
        onMove={(
          selectedInfos: Array<FileInfo<ElementInfo>>,
          parentInfo?: FileInfo<ElementInfo>,
          prevInfo?: FileInfo<ElementInfo>,
        ) => onMove(selectedInfos, parentInfo, prevInfo)}
        FileComponent={renderFile}
      />
    );
  },
};
