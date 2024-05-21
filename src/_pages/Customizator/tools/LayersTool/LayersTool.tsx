import MoveableHelper from 'moveable-helper';
import { RefObject, useCallback } from 'react';
import Selecto from 'react-selecto';

import { Viewport } from '@/_pages/Customizator/components';
import File from '@/_pages/Customizator/components/Folder/File';
import Folder, { FileInfo } from '@/_pages/Customizator/components/Folder/Folder';
import { LayersIcon } from '@/_pages/Customizator/Icons/LayersIcon';
import LabelBox from '@/_pages/Customizator/Inputs/LabelBox';
import { getIds, isScenaFunction, moves } from '@/_pages/Customizator/utils';
import { isString } from '@daybrush/utils';

import type {
  ElementInfo,
  EventBus,
  HistoryManager,
  Tab,
  TargetsManager,
} from '@/_pages/Customizator/types';
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

export const LayersTool: Tab = {
  id: 'Layers',
  type: 'tab',
  title: 'layers',
  icon: (selected) => (selected ? <LayersIcon stroke="#fff" /> : <LayersIcon />),
  subMenuWidth: 200,
  Component: ({
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
  }: PropTypes) => {
    const viewport = viewportRef.current;

    const infosInitial = viewport?.getViewportInfos() ?? [];
    //reverse element array to display elements with topmost z-index on top
    const infos = [...infosInitial].reverse();
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
