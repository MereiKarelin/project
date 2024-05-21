import MoveableHelper from 'moveable-helper';
import { RefObject, useCallback } from 'react';
import Moveable from 'react-moveable';

import { Viewport } from '@/_pages/Customizator/components';
import { FontIcon } from '@/_pages/Customizator/Icons/FontIcon';
import SelectBox from '@/_pages/Customizator/Inputs/SelectBox';
import TabInputBox from '@/_pages/Customizator/Inputs/TabInputBox';
import TextBox from '@/_pages/Customizator/Inputs/TextBox';
import {
  EventBus,
  HistoryManager,
  Tab,
  TargetsManager,
  ToolManager,
} from '@/_pages/Customizator/types';
import { setProperty } from '@/_pages/Customizator/utils';
import { getProperties } from '@/_pages/Customizator/utils/MoveableHelper';

const FONT_FAMILY_PROPS = {
  options: ['sans-serif'],
};
const TEXT_ALIGN_PROPS = {
  options: ['left', 'center', 'right', 'justify'],
};
const FONT_STYLE_PROPS = {
  options: ['normal', 'italic', 'blique'],
};
const FONT_WEIGHT_PROPS = {
  options: ['100', '200', '300', 'normal', '500', '600', 'bold', '800'],
};
const TEXT_DECORATION_PROPS = {
  options: ['none', 'underline', 'overline', 'line-through'],
};

const handleChangeSize = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-size', v);
};
const handleChangeAlign = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('text-align', v);
};
const handleChangeFamily = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-family', v);
};
const handleChangeStyle = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-style', v);
};
const handleChangeWeight = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-weight', v);
};
const handleChangeDecoration = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('text-decoration', v);
};

type PropTypes = {
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  viewportRef: RefObject<Viewport>;
  moveable: RefObject<Moveable>;
  toolManager: ToolManager;
  eventBus: EventBus;
  historyManager: HistoryManager;
};

export const FontPropertiesTool: Tab = {
  id: 'Font',
  type: 'tab',
  icon: () => <FontIcon />,
  title: 'Font',
  Component: ({
    targetsManager,
    moveableHelper,
    viewportRef,
    moveable,
    toolManager,
    eventBus,
    historyManager,
  }: PropTypes) => {
    const [family, size, align, style, weight, decoration] = getProperties(
      [
        ['font-family'],
        ['font-size'],
        ['text-align'],
        ['font-style'],
        ['font-weight'],
        ['text-decoration'],
      ],
      ['sans-serif', '14px', 'left', 'normal', 'normal', 'none'],
      moveableHelper,
      targetsManager,
      toolManager,
    );

    const changeProperty = useCallback(
      (key: string, v: any) => {
        toolManager.toolProperties.set(key, v);
        const targets = targetsManager.selectedTargets;
        setProperty(
          [key],
          v,
          viewportRef,
          moveable,
          targetsManager,
          moveableHelper,
          eventBus,
          historyManager,
          true,
        );
        targetsManager.setSelectedTargets(targets);
      },
      [
        toolManager,
        viewportRef,
        moveable,
        targetsManager,
        moveableHelper,
        eventBus,
        historyManager,
      ],
    );

    return (
      <div className="flex flex-row">
        <div className="flex flex-col w-28 p-1 gap-2">
          <TabInputBox
            label="family"
            input={SelectBox}
            props={FONT_FAMILY_PROPS}
            value={family}
            updateValue={true}
            onChange={(v: any) => handleChangeFamily(v, changeProperty)}
          />
          <TabInputBox
            label="align"
            input={SelectBox}
            props={TEXT_ALIGN_PROPS}
            value={align}
            updateValue={true}
            onChange={(v: any) => handleChangeAlign(v, changeProperty)}
          />
          <TabInputBox
            label="weight"
            input={SelectBox}
            props={FONT_WEIGHT_PROPS}
            value={weight}
            updateValue={true}
            onChange={(v: any) => handleChangeWeight(v, changeProperty)}
          />
        </div>
        <div className="flex flex-col w-24 p-1 gap-2">
          <TabInputBox
            label="size"
            input={TextBox}
            value={size}
            updateValue={true}
            onChange={(v: any) => handleChangeSize(v, changeProperty)}
            props={{ className: 'w-24' }}
          />

          <TabInputBox
            label="style"
            input={SelectBox}
            props={FONT_STYLE_PROPS}
            value={style}
            updateValue={true}
            onChange={(v: any) => handleChangeStyle(v, changeProperty)}
          />

          <TabInputBox
            label="decoration"
            input={SelectBox}
            props={TEXT_DECORATION_PROPS}
            value={decoration}
            updateValue={true}
            onChange={(v: any) => handleChangeDecoration(v, changeProperty)}
          />
        </div>
      </div>
    );
  },
  subMenuWidth: 232,
};
